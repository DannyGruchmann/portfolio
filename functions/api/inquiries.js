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
  const company = sanitizeText(payload?.company, 160);
  const budget = sanitizeText(payload?.budget, 40);
  const message = sanitizeText(payload?.message, 4000);

  if (!name) {
    return json({ detail: "Name is required" }, 422);
  }

  if (!EMAIL_RE.test(email)) {
    return json({ detail: "A valid email is required" }, 422);
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
  const subject = `Neue Portfolio-Anfrage von ${name}`;

  const html = `
    <h1>Neue Anfrage ueber das Portfolio-Formular</h1>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Firma:</strong> ${escapeHtml(company || "Nicht angegeben")}</p>
    <p><strong>Budget:</strong> ${escapeHtml(budget || "Nicht angegeben")}</p>
    <p><strong>Zeitpunkt:</strong> ${escapeHtml(createdAt)}</p>
    <p><strong>Nachricht:</strong></p>
    <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
  `;

  const text = [
    "Neue Anfrage ueber das Portfolio-Formular",
    "",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Firma: ${company || "Nicht angegeben"}`,
    `Budget: ${budget || "Nicht angegeben"}`,
    `Zeitpunkt: ${createdAt}`,
    "",
    "Nachricht:",
    message,
  ].join("\n");

  try {
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
        name,
        email,
        company,
        budget,
        message,
        createdAt,
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
