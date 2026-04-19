# API Contracts — Danny Gruchmann Portfolio

## Scope of this phase
Only the **Contact form** is wired to the backend. Everything else (projects, services, tech stack, translations) stays as static client-side data in `frontend/src/data/mock.js`.

## Previously Mocked
- Contact form submissions were stored in `localStorage` under key `dg_inquiries`
- Will now be persisted to MongoDB via FastAPI

## Endpoints

### POST `/api/inquiries`
Create a new contact inquiry.

**Request body (JSON):**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "company": "string (optional)",
  "budget": "string (optional)",
  "message": "string (required, min 2 chars)"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "name": "...",
  "email": "...",
  "company": "...",
  "budget": "...",
  "message": "...",
  "createdAt": "ISO-8601 timestamp"
}
```

**Error responses:**
- `422` Unprocessable Entity — validation errors (handled by FastAPI/Pydantic)

### GET `/api/inquiries` (optional – owner use)
Returns all inquiries (newest first, capped at 500). No auth for MVP.

## Mongo Model (`inquiries` collection)
```
{
  id: uuid str,
  name: str,
  email: str,
  company: str | "",
  budget: str | "",
  message: str,
  createdAt: datetime (utc)
}
```

## Frontend integration
File: `frontend/src/components/Contact.jsx`
- Replace the `localStorage.push` logic with `axios.post(${API}/inquiries, form)`
- On success: show toast `t.contact.form.sent`, reset form
- On network/validation error: show destructive toast with backend error message (fallback to generic message)
- Keep the `sent` success state animation

Backend base URL: `process.env.REACT_APP_BACKEND_URL` → `${BACKEND_URL}/api`

## Cloudflare Pages Function
For the Cloudflare deployment, the contact form can be handled directly by a Pages Function at `frontend/functions/api/inquiries.js`.

Cloudflare requirements:
- Add a `send_email` binding named `EMAIL`
- Set `CONTACT_FROM_EMAIL` to a sender on your domain, for example `kontakt@dannygruchmann.com`
- Set `CONTACT_TO_EMAIL` to your inbox, for example `dannygruchmann@proton.me`

Frontend behavior:
- If `REACT_APP_BACKEND_URL` is set, the frontend uses that external backend
- If `REACT_APP_BACKEND_URL` is unset, the frontend posts to the same-origin Cloudflare route `/api/inquiries`

## Non-changes
- Routing, auth, env files, Kubernetes ingress → untouched
- All API routes stay prefixed with `/api`
- MongoDB uses existing `MONGO_URL` + `DB_NAME`
