import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

// Allow a larger JSON body so an applicant's resume (base64, capped ~3MB raw)
// fits within Vercel's ~4.5MB request limit.
export const config = { api: { bodyParser: { sizeLimit: "4.5mb" } } };

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

// Unicode font (Latin + Cyrillic) so EN/ES/RU/UK applications render correctly.
// Fetched once and cached on the warm function instance. Falls back to a built-in
// Latin font (with non-Latin chars stripped) if the fetch fails.
let fontCache: { regular: Uint8Array; bold: Uint8Array } | null = null;
const FONT_REGULAR = "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf";
const FONT_BOLD = "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf";

async function loadUnicodeFonts() {
  if (fontCache) return fontCache;
  const [regular, bold] = await Promise.all([
    fetch(FONT_REGULAR).then((r) => r.arrayBuffer()),
    fetch(FONT_BOLD).then((r) => r.arrayBuffer()),
  ]);
  fontCache = { regular: new Uint8Array(regular), bold: new Uint8Array(bold) };
  return fontCache;
}

// OMNI logo for the PDF header (same image the jobs form uses). Fetched once and
// cached on the warm instance; logo is optional — header falls back to text only.
const LOGO_URL = "https://instasize.com/api/image/1153979b56eba5adc7c7f7b19026761dd85102d526713affa24228126f0df1b6.jpeg";
let logoCache: { bytes: Uint8Array; type: "jpg" | "png" } | null | undefined;

async function loadLogo() {
  if (logoCache !== undefined) return logoCache;
  try {
    const bytes = new Uint8Array(await fetch(LOGO_URL).then((r) => r.arrayBuffer()));
    let type: "jpg" | "png" | null = null;
    if (bytes[0] === 0xff && bytes[1] === 0xd8) type = "jpg";
    else if (bytes[0] === 0x89 && bytes[1] === 0x50) type = "png";
    logoCache = type ? { bytes, type } : null;
  } catch {
    logoCache = null;
  }
  return logoCache;
}

type Field = { label: string; value: string };
type Section = { title: string; fields: Field[] };

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 54;
const NAVY = rgb(0.114, 0.227, 0.431);
const GOLD = rgb(0.784, 0.573, 0.165);
const DARK = rgb(0.067, 0.094, 0.153);
const GREY = rgb(0.294, 0.333, 0.388);
const RULE = rgb(0.8, 0.84, 0.9);

async function buildApplicationPdf(applicantName: string, sections: Section[]): Promise<string> {
  const doc = await PDFDocument.create();

  let font: PDFFont;
  let bold: PDFFont;
  let unicode = true;
  try {
    doc.registerFontkit(fontkit);
    const f = await loadUnicodeFonts();
    font = await doc.embedFont(f.regular, { subset: true });
    bold = await doc.embedFont(f.bold, { subset: true });
  } catch {
    font = await doc.embedFont(StandardFonts.Helvetica);
    bold = await doc.embedFont(StandardFonts.HelveticaBold);
    unicode = false;
  }

  // Built-in fonts only encode WinAnsi (Latin-1); strip anything else.
  const clean = (s: string) => (unicode ? s : s.replace(/[^\x00-\xff]/g, "?"));

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const ensure = (space: number) => {
    if (y - space < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  };

  const wrap = (text: string, fnt: PDFFont, size: number, maxW: number): string[] => {
    const out: string[] = [];
    for (const rawLine of String(text).split("\n")) {
      const words = rawLine.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        out.push("");
        continue;
      }
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (fnt.widthOfTextAtSize(test, size) > maxW && line) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) out.push(line);
    }
    return out.length ? out : [""];
  };

  const draw = (
    text: string,
    opts: { fnt?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {},
  ) => {
    const fnt = opts.fnt ?? font;
    const size = opts.size ?? 10;
    const color = opts.color ?? DARK;
    const indent = opts.indent ?? 0;
    const gap = opts.gap ?? 4;
    const maxW = PAGE_W - 2 * MARGIN - indent;
    for (const line of wrap(clean(text), fnt, size, maxW)) {
      ensure(size + gap);
      page.drawText(line, { x: MARGIN + indent, y: y - size, size, font: fnt, color });
      y -= size + gap;
    }
  };

  // Header — logo at top-left, title block to its right.
  const topY = y;
  let textIndent = 0;
  let logoBottom = topY;
  const logo = await loadLogo();
  if (logo) {
    try {
      const img = logo.type === "jpg" ? await doc.embedJpg(logo.bytes) : await doc.embedPng(logo.bytes);
      const box = 56;
      const dims = img.scaleToFit(box, box);
      page.drawImage(img, { x: MARGIN, y: topY - dims.height, width: dims.width, height: dims.height });
      textIndent = box + 16;
      logoBottom = topY - dims.height;
    } catch {
      /* logo failed to embed — fall back to a text-only header */
    }
  }
  draw("OMNI Management", { fnt: bold, size: 20, color: NAVY, indent: textIndent, gap: 3 });
  draw("Employment Application — Cleaning Staff & Maintenance", { size: 11, color: GREY, indent: textIndent, gap: 3 });
  if (applicantName) draw(applicantName, { fnt: bold, size: 12, color: DARK, indent: textIndent, gap: 6 });
  // Clear the logo before drawing the divider.
  if (y > logoBottom) y = logoBottom;
  y -= 8;
  ensure(14);
  page.drawRectangle({ x: MARGIN, y: y - 4, width: PAGE_W - 2 * MARGIN, height: 2, color: GOLD });
  y -= 18;

  for (const section of sections) {
    const fields = (section.fields || []).filter((f) => f && f.value);
    if (fields.length === 0) continue;

    ensure(34);
    y -= 4;
    draw(section.title, { fnt: bold, size: 12.5, color: NAVY, gap: 6 });
    page.drawRectangle({ x: MARGIN, y: y + 3, width: PAGE_W - 2 * MARGIN, height: 0.75, color: RULE });
    y -= 6;

    for (const f of fields) {
      draw(f.label.toUpperCase(), { fnt: bold, size: 8, color: GREY, gap: 2 });
      draw(f.value, { size: 10.5, color: DARK, gap: 7 });
    }
    y -= 8;
  }

  const bytes = await doc.save();
  return Buffer.from(bytes).toString("base64");
}

type Resume = { filename?: unknown; contentType?: unknown; dataBase64?: unknown };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const { applicantName, position, phone, email, language, sections, resume } = req.body as {
    applicantName?: unknown;
    position?: unknown;
    phone?: unknown;
    email?: unknown;
    language?: unknown;
    sections?: unknown;
    resume?: Resume | null;
  };

  if (typeof applicantName !== "string" || !applicantName.trim()) {
    return res.status(400).json({ error: "Missing applicant name" });
  }
  if (!Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ error: "Missing application data" });
  }
  if (applicantName.length > 200) {
    return res.status(400).json({ error: "Field length exceeded" });
  }

  // Normalize/validate sections.
  const safeSections: Section[] = [];
  for (const s of sections) {
    if (!s || typeof s !== "object") continue;
    const title = typeof (s as Section).title === "string" ? (s as Section).title.slice(0, 200) : "";
    const rawFields = Array.isArray((s as Section).fields) ? (s as Section).fields : [];
    const fields: Field[] = [];
    for (const f of rawFields) {
      if (!f || typeof f !== "object") continue;
      const label = typeof f.label === "string" ? f.label.slice(0, 200) : "";
      const value = typeof f.value === "string" ? f.value.slice(0, 5000) : "";
      if (label) fields.push({ label, value });
    }
    if (title) safeSections.push({ title, fields });
  }
  if (safeSections.length === 0) {
    return res.status(400).json({ error: "Invalid application data" });
  }

  const applicantEmail = typeof email === "string" && isValidEmail(email) ? email : null;
  const positionStr = typeof position === "string" ? position.slice(0, 200) : "";
  const phoneStr = typeof phone === "string" ? phone.slice(0, 200) : "";
  const langStr = typeof language === "string" ? language.slice(0, 8) : "";

  // Validate optional resume attachment.
  let resumeAttachment: { name: string; contentType: string; contentBytes: string } | null = null;
  if (resume && typeof resume === "object" && typeof resume.dataBase64 === "string" && resume.dataBase64) {
    // Base64 of a ~3MB file is ~4.1M chars; cap to stay under the body limit.
    if (resume.dataBase64.length > 4_400_000) {
      return res.status(400).json({ error: "Attachment too large" });
    }
    const name = typeof resume.filename === "string" && resume.filename ? resume.filename.slice(0, 200) : "resume";
    const contentType =
      typeof resume.contentType === "string" && resume.contentType
        ? resume.contentType.slice(0, 120)
        : "application/octet-stream";
    resumeAttachment = { name, contentType, contentBytes: resume.dataBase64 };
  }

  const mailbox = process.env.NAMECHEAP_EMAIL;
  // Defaults to the sending mailbox; CONTACT_RECIPIENT redirects to a test inbox locally.
  const recipient = process.env.JOBS_RECIPIENT || process.env.CONTACT_RECIPIENT || mailbox;

  try {
    const pdfBase64 = await buildApplicationPdf(applicantName.trim(), safeSections);
    const token = await getGraphToken();

    const attachments: Array<Record<string, unknown>> = [
      {
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: `Application - ${applicantName.trim()}.pdf`.replace(/[\\/:*?"<>|]/g, "_"),
        contentType: "application/pdf",
        contentBytes: pdfBase64,
      },
    ];
    if (resumeAttachment) {
      attachments.push({
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: resumeAttachment.name,
        contentType: resumeAttachment.contentType,
        contentBytes: resumeAttachment.contentBytes,
      });
    }

    const subject = `[OMNI Jobs] Application — ${applicantName.trim()}${positionStr ? ` (${positionStr})` : ""}`;

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
            subject,
            body: {
              contentType: "HTML",
              content: `
                <h2>New Employment Application</h2>
                <p><strong>Applicant:</strong> ${escapeHtml(applicantName.trim())}</p>
                <p><strong>Position:</strong> ${escapeHtml(positionStr || "Not specified")}</p>
                <p><strong>Phone:</strong> ${escapeHtml(phoneStr || "Not provided")}</p>
                <p><strong>Email:</strong> ${escapeHtml(applicantEmail || "Not provided")}</p>
                <p><strong>Form language:</strong> ${escapeHtml(langStr || "en")}</p>
                <hr />
                <p>The full application is attached as a PDF${resumeAttachment ? ", along with the applicant's uploaded document" : ""}.</p>
              `,
            },
            toRecipients: [{ emailAddress: { address: recipient } }],
            ...(applicantEmail ? { replyTo: [{ emailAddress: { address: applicantEmail } }] } : {}),
            attachments,
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
    console.error("Application email error:", error);
    return res.status(500).json({ error: "Failed to submit application" });
  }
}
