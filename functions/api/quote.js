/**
 * Cloudflare Pages Function — POST /api/quote
 *
 * Receives the "Request My Quote" form (multipart/form-data, since it can
 * include image uploads), validates it server-side, and sends it as an
 * email via Resend (https://resend.com).
 *
 * Required environment variables (set in the Cloudflare Pages project
 * under Settings → Environment variables — NEVER commit these to git):
 *
 *   RESEND_API_KEY   Your Resend API key (Settings → API Keys in Resend).
 *   RESEND_FROM       The "from" address Resend sends as. This MUST be on a
 *                      domain you have verified in Resend (Domains tab) —
 *                      Resend will reject unverified/free-mail "from"
 *                      addresses. e.g. "Paving Unlimited <quotes@pavingunlimited.co.za>"
 *   RESEND_TO         Where the completed quote request should land, e.g.
 *                      "pavingunlimited@gmail.com". Can be a comma-separated
 *                      list if more than one person should receive it.
 *
 * Nothing else in this file needs to change to go live — once those three
 * variables are set in the Cloudflare Pages dashboard and the domain in
 * RESEND_FROM is verified, this endpoint is fully functional.
 */

const REQUIRED_FIELDS = ["fullName", "phone", "email", "area", "projectType"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\s-]{7,}$/;

// Keep total attachment payload well under Resend's per-email limit so a
// handful of phone photos can't cause the whole request to fail.
const MAX_TOTAL_ATTACHMENT_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_SINGLE_ATTACHMENT_BYTES = 4 * 1024 * 1024; // 4MB per file

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function fileToBase64(file) {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RESEND_TO) {
    // Server isn't configured yet -- fail clearly rather than silently.
    return jsonResponse(
      { success: false, error: "The quote form isn't fully configured yet. Please call or WhatsApp us directly in the meantime." },
      500
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    return jsonResponse({ success: false, error: "Could not read the submitted form." }, 400);
  }

  // Honeypot: if this hidden field has anything in it, it's almost
  // certainly a bot. Return a fake success so the bot doesn't learn to
  // avoid the field, but never actually send an email.
  const honeypot = (formData.get("companyWebsite") || "").toString().trim();
  if (honeypot) {
    return jsonResponse({ success: true });
  }

  const fields = {
    fullName: (formData.get("fullName") || "").toString().trim(),
    phone: (formData.get("phone") || "").toString().trim(),
    email: (formData.get("email") || "").toString().trim(),
    area: (formData.get("area") || "").toString().trim(),
    projectType: (formData.get("projectType") || "").toString().trim(),
    message: (formData.get("message") || "").toString().trim(),
  };

  for (const key of REQUIRED_FIELDS) {
    if (!fields[key]) {
      return jsonResponse({ success: false, error: `Missing required field: ${key}` }, 400);
    }
  }
  if (!EMAIL_RE.test(fields.email)) {
    return jsonResponse({ success: false, error: "Please provide a valid email address." }, 400);
  }
  if (!PHONE_RE.test(fields.phone)) {
    return jsonResponse({ success: false, error: "Please provide a valid phone number." }, 400);
  }

  // Collect any uploaded images, respecting size limits.
  const attachments = [];
  let totalBytes = 0;
  const files = formData.getAll("images").filter((f) => f && typeof f === "object" && f.size > 0);
  const skipped = [];
  for (const file of files) {
    if (file.size > MAX_SINGLE_ATTACHMENT_BYTES) {
      skipped.push(file.name);
      continue;
    }
    if (totalBytes + file.size > MAX_TOTAL_ATTACHMENT_BYTES) {
      skipped.push(file.name);
      continue;
    }
    attachments.push({
      filename: file.name || "photo.jpg",
      content: await fileToBase64(file),
    });
    totalBytes += file.size;
  }

  const projectTypeLabels = {
    driveway: "Driveway",
    patio: "Patio",
    "estate-road": "Estate Road",
    "pool-area": "Pool Area",
    kerbing: "Kerbing",
    repairs: "Repairs & Maintenance",
    other: "Other",
  };
  const projectTypeLabel = projectTypeLabels[fields.projectType] || fields.projectType;

  const html = `
    <h2 style="font-family:sans-serif;color:#1C1C1C;">New quote request — Paving Unlimited website</h2>
    <table style="font-family:sans-serif;font-size:15px;color:#1C1C1C;border-collapse:collapse;">
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Name</td><td>${escapeHtml(fields.fullName)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Phone</td><td>${escapeHtml(fields.phone)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Email</td><td>${escapeHtml(fields.email)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Area</td><td>${escapeHtml(fields.area)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Project type</td><td>${escapeHtml(projectTypeLabel)}</td></tr>
    </table>
    ${fields.message ? `<p style="font-family:sans-serif;font-size:15px;color:#1C1C1C;"><strong>Message:</strong><br>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p>` : ""}
    ${attachments.length ? `<p style="font-family:sans-serif;font-size:13px;color:#6B6B6B;">${attachments.length} image(s) attached.</p>` : ""}
    ${skipped.length ? `<p style="font-family:sans-serif;font-size:13px;color:#B45309;">Note: ${skipped.length} uploaded file(s) were too large to attach and were not included: ${escapeHtml(skipped.join(", "))}.</p>` : ""}
  `;

  const resendPayload = {
    from: env.RESEND_FROM,
    to: env.RESEND_TO.split(",").map((s) => s.trim()).filter(Boolean),
    reply_to: fields.email,
    subject: `New quote request — ${fields.fullName} (${projectTypeLabel})`,
    html,
  };
  if (attachments.length) {
    resendPayload.attachments = attachments;
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend API error:", resendRes.status, errText);
      return jsonResponse(
        { success: false, error: "We couldn't send your request right now. Please call or WhatsApp us directly." },
        502
      );
    }

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("Quote form submission failed:", err);
    return jsonResponse(
      { success: false, error: "We couldn't send your request right now. Please call or WhatsApp us directly." },
      500
    );
  }
}

// Reject any method other than POST with a clear response instead of a
// generic Cloudflare 404/405.
export async function onRequestGet() {
  return jsonResponse({ success: false, error: "This endpoint only accepts POST requests." }, 405);
}
