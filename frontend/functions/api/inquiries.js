const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[- 0-9()/]{6,30}$/;

const sanitizeText = (value, maxLength) => {
  const text = typeof value === "string" ? value.trim() : "";
  return text.slice(0, maxLength);
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const sendLeadWebhook = async (env, payload) => {
  if (!env.LEAD_WEBHOOK_URL) return null;

  const response = await fetch(env.LEAD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "dglabs-lead-webhook/1.0",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Lead webhook failed with status ${response.status}`);
  }

  return { status: response.status };
};

export const onRequestOptions = async () => json({ ok: true });

export const onRequestPost = async ({ request, env }) => {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ detail: "Invalid JSON body" }, 400);
  }

  const name = sanitizeText(payload?.name, 120);
  const email = sanitizeText(payload?.email, 320).toLowerCase();
  const phone = sanitizeText(payload?.phone, 80);
  const company = sanitizeText(payload?.company, 160);
  const industry = sanitizeText(payload?.industry, 120);
  const goal = sanitizeText(payload?.goal, 120);
  const timeline = sanitizeText(payload?.timeline, 120);
  const budget = sanitizeText(payload?.budget, 40);
  const message = sanitizeText(payload?.message, 4000);

  if (!name) {
    return json({ detail: "Name is required" }, 422);
  }

  if (!EMAIL_RE.test(email)) {
    return json({ detail: "A valid email is required" }, 422);
  }

  if (phone && !PHONE_RE.test(phone)) {
    return json({ detail: "A valid phone number is required" }, 422);
  }

  if (message.length < 2) {
    return json({ detail: "Message must be at least 2 characters long" }, 422);
  }

  if (!env.RESEND_API_KEY) {
    return json({ detail: "RESEND_API_KEY is not configured" }, 500);
  }

  const recipient = env.CONTACT_TO_EMAIL || "dannygruchmann@proton.me";
  const sender = env.CONTACT_FROM_EMAIL || "kontakt@dannygruchmann.com";
  const createdAt = new Date().toISOString();
  const lead = {
    source: "dannygruchmann.com",
    brand: "DGLabs",
    name,
    email,
    phone,
    company,
    industry,
    goal,
    timeline,
    budget,
    message,
    createdAt,
  };
  const subject = `Neue DGLabs-Anfrage von ${name}`;

  const html = `
    <h1>Neue Anfrage über das DGLabs-Formular</h1>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(phone || "Nicht angegeben")}</p>
    <p><strong>Firma:</strong> ${escapeHtml(company || "Nicht angegeben")}</p>
    <p><strong>Branche:</strong> ${escapeHtml(industry || "Nicht angegeben")}</p>
    <p><strong>Ziel:</strong> ${escapeHtml(goal || "Nicht angegeben")}</p>
    <p><strong>Startzeitpunkt:</strong> ${escapeHtml(timeline || "Nicht angegeben")}</p>
    <p><strong>Budget:</strong> ${escapeHtml(budget || "Nicht angegeben")}</p>
    <p><strong>Zeitpunkt:</strong> ${escapeHtml(createdAt)}</p>
    <p><strong>Nachricht:</strong></p>
    <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
  `;

  const text = [
    "Neue Anfrage über das DGLabs-Formular",
    "",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone || "Nicht angegeben"}`,
    `Firma: ${company || "Nicht angegeben"}`,
    `Branche: ${industry || "Nicht angegeben"}`,
    `Ziel: ${goal || "Nicht angegeben"}`,
    `Startzeitpunkt: ${timeline || "Nicht angegeben"}`,
    `Budget: ${budget || "Nicht angegeben"}`,
    `Zeitpunkt: ${createdAt}`,
    "",
    "Nachricht:",
    message,
  ].join("\n");

  try {
    let webhookResult = null;
    try {
      webhookResult = await sendLeadWebhook(env, lead);
    } catch (webhookError) {
      console.error("Lead webhook request failed:", webhookError);
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "dannygruchmann-portfolio/1.0",
      },
      body: JSON.stringify({
        from: `Danny Gruchmann Portfolio <${sender}>`,
        to: [recipient],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    const result = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", result);
      return json(
        {
          detail: result?.message || result?.error || "Failed to send inquiry email",
          code: result?.name || "RESEND_SEND_FAILED",
        },
        500
      );
    }

    return json(
      {
        id: result.id,
        ...lead,
        webhookDelivered: Boolean(webhookResult),
      },
      201
    );
  } catch (error) {
    console.error("Resend request failed:", error);
    return json(
      {
        detail: error?.message || "Failed to send inquiry email",
        code: "RESEND_REQUEST_FAILED",
      },
      500
    );
  }
};
