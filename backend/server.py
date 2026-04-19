from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import smtplib
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from email.message import EmailMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ───────────────────────────────────────────────────────────
# Contact Inquiries
# ───────────────────────────────────────────────────────────
class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default="", max_length=160)
    budget: Optional[str] = Field(default="", max_length=40)
    message: str = Field(..., min_length=2, max_length=4000)

    @field_validator("name", "message")
    @classmethod
    def _strip_not_empty(cls, v: str) -> str:
        v = (v or "").strip()
        if not v:
            raise ValueError("must not be empty")
        return v


class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: str = ""
    budget: str = ""
    message: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def _env_flag(name: str, default: bool = False) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _send_inquiry_notification(inquiry: Inquiry) -> None:
    smtp_host = os.environ.get("SMTP_HOST", "").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_username = os.environ.get("SMTP_USERNAME", "").strip()
    smtp_password = os.environ.get("SMTP_PASSWORD", "").strip()
    smtp_from = os.environ.get("SMTP_FROM_EMAIL", "").strip()
    notify_to = os.environ.get("INQUIRY_NOTIFICATION_TO", "").strip()
    use_tls = _env_flag("SMTP_USE_TLS", default=True)
    use_ssl = _env_flag("SMTP_USE_SSL", default=False)

    if not smtp_host or not smtp_from or not notify_to:
        logger.info(
            "Inquiry notification skipped because SMTP is not fully configured "
            "(SMTP_HOST, SMTP_FROM_EMAIL, INQUIRY_NOTIFICATION_TO)"
        )
        return

    company = inquiry.company or "Nicht angegeben"
    budget = inquiry.budget or "Nicht angegeben"
    created_at = inquiry.createdAt.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    msg = EmailMessage()
    msg["Subject"] = f"Neue Portfolio-Anfrage von {inquiry.name}"
    msg["From"] = smtp_from
    msg["To"] = notify_to
    msg["Reply-To"] = str(inquiry.email)
    msg.set_content(
        "Neue Anfrage ueber das Portfolio-Formular\n\n"
        f"Name: {inquiry.name}\n"
        f"E-Mail: {inquiry.email}\n"
        f"Firma: {company}\n"
        f"Budget: {budget}\n"
        f"Zeitpunkt: {created_at}\n\n"
        "Nachricht:\n"
        f"{inquiry.message}\n"
    )

    if use_ssl:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20) as server:
            if smtp_username and smtp_password:
                server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        if use_tls:
            server.starttls()
        if smtp_username and smtp_password:
            server.login(smtp_username, smtp_password)
        server.send_message(msg)


@api_router.post("/inquiries", response_model=Inquiry, status_code=201)
async def create_inquiry(payload: InquiryCreate):
    inq = Inquiry(
        name=payload.name.strip(),
        email=payload.email,
        company=(payload.company or "").strip(),
        budget=(payload.budget or "").strip(),
        message=payload.message.strip(),
    )
    doc = inq.model_dump()
    doc["createdAt"] = doc["createdAt"].isoformat()
    await db.inquiries.insert_one(doc)
    logger.info("New inquiry from %s <%s>", inq.name, inq.email)
    try:
        _send_inquiry_notification(inq)
    except Exception:
        logger.exception("Failed to send inquiry notification email")
    return inq


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries():
    rows = await db.inquiries.find({}, {"_id": 0}).sort("createdAt", -1).to_list(500)
    for r in rows:
        if isinstance(r.get("createdAt"), str):
            r["createdAt"] = datetime.fromisoformat(r["createdAt"])
    return rows

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
