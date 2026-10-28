import type { VercelRequest, VercelResponse } from "@vercel/node";
import sharp from "sharp";

// Returns ONE attachment of a schedule event (inspection / scheduled work) to the Firebase work-order app,
// so it can put the actual file into the event's printout / PDF. Images come back as an upright, resized JPEG;
// PDFs come back unchanged (up to the 4.5 MB response limit). The browser can't download Storage files itself
// (the bucket has no CORS rules), so this endpoint fetches them server-side.
//
// Safe by construction (same design as /api/wo-photo): the caller sends only {eventId, index} plus their Firebase
// ID token. The event document is read from Firestore REST *with the caller's own token* (security rules decide
// whether they may read it), and the file URL comes from that document — never from the request — and must point
// at this project's Storage bucket under scheduleEvents/.

const FIREBASE_PROJECT_ID = "omni-management-81ded";
const STORAGE_PREFIX = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_PROJECT_ID}.firebasestorage.app/o/scheduleEvents%2F`;
const ALLOWED_ORIGINS = [
  "https://omni-management-81ded.web.app",
  "https://omni-management-81ded.firebaseapp.com",
];
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const MAX_PDF_BYTES = 4.2 * 1024 * 1024; // Vercel functions can return at most ~4.5 MB

// 120 files per 10 minutes per user (in-memory, per warm instance)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 120;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(key, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

type FsStr = { stringValue?: string };
type FsDoc = { fields?: { attachments?: { arrayValue?: { values?: { mapValue?: { fields?: { url?: FsStr; name?: FsStr } } }[] } } } };

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
  const { idToken, eventId, index } = body as Record<string, unknown>;

  if (typeof idToken !== "string" || idToken.length > 4000) return res.status(401).json({ error: "Not signed in" });
  if (typeof eventId !== "string" || !/^[A-Za-z0-9]{10,40}$/.test(eventId)) return res.status(400).json({ error: "Invalid event" });
  if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || index > 49) return res.status(400).json({ error: "Invalid file index" });

  let uid: string | undefined;
  try {
    const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString("utf8"));
    uid = payload.user_id || payload.sub;
  } catch {
    return res.status(401).json({ error: "Not signed in" });
  }
  if (!uid || !/^[A-Za-z0-9]{10,128}$/.test(uid)) return res.status(401).json({ error: "Not signed in" });
  if (isRateLimited(uid)) return res.status(429).json({ error: "Too many requests. Please try again shortly." });

  try {
    const docRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/scheduleEvents/${eventId}`,
      { headers: { Authorization: `Bearer ${idToken}` } },
    );
    if (docRes.status === 404) return res.status(404).json({ error: "Event not found" });
    if (!docRes.ok) return res.status(403).json({ error: "Not allowed to view this event" });

    const doc = (await docRes.json()) as FsDoc;
    const f = doc.fields?.attachments?.arrayValue?.values?.[index]?.mapValue?.fields;
    const url = f?.url?.stringValue;
    const name = f?.name?.stringValue || "";
    if (!url) return res.status(404).json({ error: "File not found" });
    if (!url.startsWith(STORAGE_PREFIX)) return res.status(400).json({ error: "Unsupported file location" });

    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(name);
    const isPdf = /\.pdf$/i.test(name);
    if (!isImage && !isPdf) return res.status(415).json({ error: "Only images and PDFs can be included" });

    const fileRes = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!fileRes.ok) throw new Error(`Storage fetch failed (${fileRes.status})`);
    if (Number(fileRes.headers.get("content-length") || 0) > MAX_SOURCE_BYTES) return res.status(413).json({ error: "File too large" });
    const source = Buffer.from(await fileRes.arrayBuffer());
    if (source.length > MAX_SOURCE_BYTES) return res.status(413).json({ error: "File too large" });

    res.setHeader("Cache-Control", "private, no-store");
    if (isPdf) {
      if (source.length > MAX_PDF_BYTES) return res.status(413).json({ error: "PDF is over 4 MB — too large to include" });
      if (source.subarray(0, 5).toString("latin1") !== "%PDF-") return res.status(415).json({ error: "Not a valid PDF" });
      res.setHeader("Content-Type", "application/pdf");
      return res.status(200).send(source);
    }

    const out = await sharp(source)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82 })
      .toBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    return res.status(200).send(out);
  } catch (error) {
    console.error("event-file error:", error);
    return res.status(500).json({ error: "Could not load the file" });
  }
}
