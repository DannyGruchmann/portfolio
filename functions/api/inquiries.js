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

const sendResendEmail = async (env, payload) => {
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "dannygruchmann-portfolio/1.0",
    },
    body: JSON.stringify(payload),
  });

  const result = await resendResponse.json();

  if (!resendResponse.ok) {
    throw new Error(result?.message || result?.error || "Failed to send email via Resend");
  }

  return result;
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
  const ownerReplyTo = email;

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

  const autoReplySubject = "Danke fuer deine Anfrage";
  const autoReplyHtml = `
    <div style="margin:0;padding:32px 16px;background:#06080d;font-family:Inter,Segoe UI,Arial,sans-serif;color:#e8eef8;">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(124,200,255,0.18);border-radius:24px;overflow:hidden;background:linear-gradient(180deg,#11141b 0%,#0a0d13 100%);box-shadow:0 24px 80px rgba(0,0,0,0.35);">
        <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);background:radial-gradient(circle at top left, rgba(124,200,255,0.18), transparent 42%);">
          <div style="font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#7cc8ff;margin-bottom:14px;">Danny Gruchmann</div>
          <h1 style="margin:0;font-size:32px;line-height:1.15;color:#ffffff;">Danke fuer deine Anfrage.</h1>
          <p style="margin:14px 0 0;color:#aeb9cc;font-size:16px;line-height:1.7;">
            Ich habe deine Nachricht erhalten und melde mich in der Regel innerhalb von 24 Stunden mit einer ersten Rueckmeldung.
          </p>
        </div>
        <div style="padding:28px 32px 10px;">
          <div style="padding:18px 20px;border:1px solid rgba(255,255,255,0.08);border-radius:18px;background:#0b111a;">
            <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#7c8699;margin-bottom:12px;">Deine Anfrage</div>
            <div style="color:#ffffff;font-size:15px;line-height:1.8;">
              <div><strong>Name:</strong> ${escapeHtml(name)}</div>
              <div><strong>E-Mail:</strong> ${escapeHtml(email)}</div>
              <div><strong>Firma:</strong> ${escapeHtml(company || "Nicht angegeben")}</div>
              <div><strong>Budget:</strong> ${escapeHtml(budget || "Nicht angegeben")}</div>
            </div>
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);color:#d8e2f0;font-size:15px;line-height:1.75;">
              ${escapeHtml(message).replaceAll("\n", "<br />")}
            </div>
          </div>
        </div>
        <div style="padding:0 32px 28px;">
          <p style="margin:0 0 18px;color:#aeb9cc;font-size:15px;line-height:1.7;">
            Falls du noch etwas ergaenzen willst, kannst du einfach auf diese E-Mail antworten.
          </p>
          <a href="mailto:${escapeHtml(sender)}" style="display:inline-block;padding:13px 20px;border-radius:999px;background:linear-gradient(180deg,#7fd7ff 0%,#2ca5f5 100%);color:#06111a;text-decoration:none;font-weight:700;">
            Direkt antworten
          </a>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);color:#7c8699;font-size:13px;line-height:1.7;">
          Danny Gruchmann<br />
          Web Development, Automatisierung & digitale Systeme<br />
          <a href="https://dannygruchmann.com" style="color:#7cc8ff;text-decoration:none;">dannygruchmann.com</a>
        </div>
      </div>
    </div>
  `;

  const autoReplyText = [
    "Danke fuer deine Anfrage.",
    "",
    "Ich habe deine Nachricht erhalten und melde mich in der Regel innerhalb von 24 Stunden mit einer ersten Rueckmeldung.",
    "",
    "Deine Anfrage:",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Firma: ${company || "Nicht angegeben"}`,
    `Budget: ${budget || "Nicht angegeben"}`,
    "",
    "Nachricht:",
    message,
    "",
    "Falls du noch etwas ergaenzen willst, kannst du einfach auf diese E-Mail antworten.",
    "",
    "Danny Gruchmann",
    "https://dannygruchmann.com",
  ].join("\n");

  try {
    const ownerEmailResult = await sendResendEmail(env, {
      from: `Danny Gruchmann Portfolio <${sender}>`,
      to: [recipient],
      reply_to: ownerReplyTo,
      subject,
      html,
      text,
    });

    await sendResendEmail(env, {
      from: `Danny Gruchmann <${sender}>`,
      to: [email],
      reply_to: sender,
      subject: autoReplySubject,
      html: autoReplyHtml,
      text: autoReplyText,
    });

    return json(
      {
        id: ownerEmailResult.id,
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
