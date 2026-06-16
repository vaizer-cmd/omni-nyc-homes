import type { VercelRequest, VercelResponse } from "@vercel/node";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

// Fetch an app-only access token from Microsoft Entra ID (OAuth2 client credentials).
async function getGraphToken(): Promise<string> {
  const tenantId = process.env.M365_TENANT_ID;
  const clientId = process.env.M365_CLIENT_ID;
  const clientSecret = process.env.M365_CLIENT_SECRET;

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId ?? "",
      client_secret: clientSecret ?? "",
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Token request failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("No access_token in token response");
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof subject !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid field types" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (name.length > 200 || email.length > 200 || subject.length > 500 || message.length > 5000) {
    return res.status(400).json({ error: "Field length exceeded" });
  }

  // The licensed Microsoft 365 mailbox that sends the notification (must be a
  // real mailbox the app has Mail.Send permission for — cannot be arbitrary).
  const mailbox = process.env.NAMECHEAP_EMAIL;
  // Who receives the notification. Defaults to the mailbox itself; override with
  // CONTACT_RECIPIENT (e.g. a test inbox) for local development.
  const recipient = process.env.CONTACT_RECIPIENT || mailbox;

  try {
    const token = await getGraphToken();

    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox ?? "")}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: `[OMNI Contact] ${escapeHtml(subject)}`,
            body: {
              contentType: "HTML",
              content: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <hr />
                <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
              `,
            },
            toRecipients: [{ emailAddress: { address: recipient } }],
            replyTo: [{ emailAddress: { address: email } }],
          },
          saveToSentItems: false,
        }),
      },
    );

    if (!graphRes.ok) {
      const detail = await graphRes.text();
      throw new Error(`Graph sendMail failed (${graphRes.status}): ${detail}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
