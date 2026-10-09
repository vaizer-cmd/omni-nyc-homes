import type { VercelRequest, VercelResponse } from "@vercel/node";

// Emails a work schedule (built by the Firebase work-order app) from the company mailbox.
// Called cross-origin from https://omni-management-81ded.web.app — only a signed-in ADMIN of that
// Firebase project may send (verified below), so this cannot be used as an open mail relay.

const FIREBASE_PROJECT_ID = "omni-management-81ded";
const ALLOWED_ORIGINS = [
  "https://omni-management-81ded.web.app",
  "https://omni-management-81ded.firebaseapp.com",
];
const LOGO_URL = "https://omnipropm.com/email/omni-logo.png";
const CLIENT_PORTAL_URL = "https://www.omnipropm.com/clients";

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

// 5 sends per 10 minutes per user (in-memory, per warm instance)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(key, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

// Returns the Firebase uid if the ID token belongs to an admin of the work-order app, else null.
// Firestore REST validates the token itself (rules only let a user read their own users/{uid}
// doc), so a forged or expired token is rejected there; the uid is read from the token payload.
async function verifyAdmin(idToken: string): Promise<string | null> {
  let uid: string | undefined;
  try {
    const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString("utf8"));
    uid = payload.user_id || payload.sub;
  } catch {
    return null;
  }
  if (!uid || !/^[A-Za-z0-9]{10,128}$/.test(uid)) return null;

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`,
    { headers: { Authorization: `Bearer ${idToken}` } },
  );
  if (!res.ok) return null;
  const doc = (await res.json()) as { fields?: { role?: { stringValue?: string } } };
  return doc.fields?.role?.stringValue === "admin" ? uid : null;
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

type Item = { date: string; time: string; label: string; desc: string; loc: string; type: string };

const TYPE_LABELS: Record<string, string> = { wo: "Work Order", inspection: "Inspection" };
const typeLabel = (t: string) => TYPE_LABELS[t] || "Scheduled Work";

function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return "";
  return `${h % 12 || 12}:${String(m || 0).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function dayLabel(ds: string): string {
  return new Date(`${ds}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

function parseItems(raw: unknown): Item[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 300) return null;
  const items: Item[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") return null;
    const o = r as Record<string, unknown>;
    const date = str(o.date, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    const time = str(o.time, 5);
    items.push({
      date,
      time: /^\d{2}:\d{2}$/.test(time) ? time : "",
      label: str(o.label, 120),
      desc: str(o.desc, 600),
      loc: str(o.loc, 120),
      type: str(o.type, 20),
    });
  }
  return items;
}

function buildHtml(title: string, property: string, items: Item[]): string {
  const byDate = new Map<string, Item[]>();
  [...items]
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || "99").localeCompare(b.time || "99"))
    .forEach((it) => byDate.set(it.date, [...(byDate.get(it.date) || []), it]));

  const days = [...byDate.entries()]
    .map(
      ([ds, list]) => `
      <h3 style="font-size:14px;margin:20px 0 6px;padding-bottom:4px;border-bottom:1px solid #1e3a6e;color:#1e3a6e">${escapeHtml(dayLabel(ds))}</h3>
      <table style="width:100%;border-collapse:collapse">${list
        .map(
          (it) => `<tr>
        <td style="width:110px;padding:6px 8px;border-bottom:1px solid #ddd;font-size:12px;color:#667;vertical-align:top">${
          it.time ? `<strong>${escapeHtml(fmtTime(it.time))}</strong><br>` : ""
        }${escapeHtml(typeLabel(it.type))}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #ddd;font-size:13px;vertical-align:top"><strong>${escapeHtml(it.label)}</strong>${
          it.desc ? `<div style="margin-top:2px">${escapeHtml(it.desc).replace(/\n/g, "<br>")}</div>` : ""
        }${it.loc ? `<div style="margin-top:2px;font-size:12px;color:#556">${escapeHtml(it.loc)}</div>` : ""}</td>
      </tr>`,
        )
        .join("")}</table>`,
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#1a2b45;max-width:640px">
    <table style="width:100%;border-bottom:3px solid #1e3a6e;margin-bottom:8px"><tr>
      <td><img src="${LOGO_URL}" alt="OMNI Management" style="height:60px;width:auto"></td>
      <td style="text-align:right">
        <div style="font-size:20px;font-weight:bold">Work Schedule</div>
        <div style="font-size:14px;font-weight:bold;margin-top:4px">Property: ${escapeHtml(property)}</div>
        <div style="font-size:12px;color:#667;margin-top:2px">${escapeHtml(title)}</div>
      </td>
    </tr></table>
    ${days}
    <p style="margin-top:28px;font-size:18px;font-weight:bold;color:#1a2b45">For more information - <a href="${CLIENT_PORTAL_URL}" style="color:#1e3a6e;text-decoration:underline">Click Here</a> to log into Client Portal</p>
    <p style="margin-top:16px;font-size:11px;color:#889">Sent by OMNI Management · (212) 460-5000 · info@omnipropm.com</p>
  </div>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string) || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!ALLOWED_ORIGINS.includes(origin)) return res.status(403).json({ error: "Forbidden" });

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const { idToken, to, title, property } = body as Record<string, unknown>;

  if (typeof idToken !== "string" || idToken.length > 4000) {
    return res.status(401).json({ error: "Not signed in" });
  }
  let uid: string | null = null;
  try {
    uid = await verifyAdmin(idToken);
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(500).json({ error: "Could not verify your account" });
  }
  if (!uid) return res.status(403).json({ error: "Only admins can email the schedule" });

  if (isRateLimited(uid)) {
    return res.status(429).json({ error: "Too many emails sent. Please try again in a few minutes." });
  }

  const recipients = (Array.isArray(to) ? to : typeof to === "string" ? [to] : [])
    .map((e) => (typeof e === "string" ? e.trim() : ""))
    .filter(Boolean);
  if (recipients.length < 1 || recipients.length > 5 || recipients.some((e) => e.length > 200 || !isValidEmail(e))) {
    return res.status(400).json({ error: "Enter 1–5 valid email addresses" });
  }

  const items = parseItems(body.items);
  const periodTitle = str(title, 100);
  if (!items || !periodTitle) return res.status(400).json({ error: "Invalid schedule data" });
  const propertyName = str(property, 100) || "2443 Poplar St.";

  // The licensed Microsoft 365 mailbox that sends (info@omnipropm.com).
  const mailbox = process.env.NAMECHEAP_EMAIL;

  try {
    const token = await getGraphToken();

    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox ?? "")}/sendMail`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            subject: `Work Schedule — ${propertyName} — ${periodTitle}`,
            body: { contentType: "HTML", content: buildHtml(periodTitle, propertyName, items) },
            toRecipients: recipients.map((address) => ({ emailAddress: { address } })),
          },
          saveToSentItems: true,
        }),
      },
    );

    if (!graphRes.ok) {
      const detail = await graphRes.text();
      throw new Error(`Graph sendMail failed (${graphRes.status}): ${detail}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Schedule email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
