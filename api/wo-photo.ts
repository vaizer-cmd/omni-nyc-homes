import type { VercelRequest, VercelResponse } from "@vercel/node";
import sharp from "sharp";

// Returns one work-order photo (resized JPEG) to the Firebase work-order app so it can put the
// photo into a downloadable PDF. The browser cannot download the images itself (the Storage
// bucket has no CORS rules), so this endpoint fetches them server-side.
//
// Safe by construction: the caller sends only {woId, kind, index} plus their Firebase ID token.
// The work-order document is read from Firestore REST *with the caller's own token* (security
// rules decide whether they may read it), and the image URL comes from that document — never
// from the request — and must point at this project's Storage bucket.

const FIREBASE_PROJECT_ID = "omni-management-81ded";
const STORAGE_PREFIX = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_PROJECT_ID}.firebasestorage.app/o/workOrders%2F`;
const ALLOWED_ORIGINS = [
  "https://omni-management-81ded.web.app",
  "https://omni-management-81ded.firebaseapp.com",
];
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;

// 150 photos per 10 minutes per user (in-memory, per warm instance)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 150;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(key, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

type FsValue = { stringValue?: string };
type FsDoc = { fields?: Record<string, { arrayValue?: { values?: FsValue[] } }> };

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
  const { idToken, woId, kind, index } = body as Record<string, unknown>;

  if (typeof idToken !== "string" || idToken.length > 4000) return res.status(401).json({ error: "Not signed in" });
  if (typeof woId !== "string" || !/^[A-Za-z0-9]{10,40}$/.test(woId)) return res.status(400).json({ error: "Invalid work order" });
  if (kind !== "photos" && kind !== "closePhotos") return res.status(400).json({ error: "Invalid photo set" });
  if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || index > 49) return res.status(400).json({ error: "Invalid photo index" });

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
    // Read the work order as the caller — Firestore rules decide whether they may see it.
    const docRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/workOrders/${woId}`,
      { headers: { Authorization: `Bearer ${idToken}` } },
    );
    if (docRes.status === 404) return res.status(404).json({ error: "Work order not found" });
    if (!docRes.ok) return res.status(403).json({ error: "Not allowed to view this work order" });

    const doc = (await docRes.json()) as FsDoc;
    const url = doc.fields?.[kind]?.arrayValue?.values?.[index]?.stringValue;
    if (!url) return res.status(404).json({ error: "Photo not found" });
    if (!url.startsWith(STORAGE_PREFIX)) return res.status(400).json({ error: "Unsupported photo location" });

    const imgRes = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!imgRes.ok) throw new Error(`Storage fetch failed (${imgRes.status})`);
    const declared = Number(imgRes.headers.get("content-length") || 0);
    if (declared > MAX_SOURCE_BYTES) return res.status(413).json({ error: "Photo too large" });
    const source = Buffer.from(await imgRes.arrayBuffer());
    if (source.length > MAX_SOURCE_BYTES) return res.status(413).json({ error: "Photo too large" });

    // Upright (EXIF), max 1400px, JPEG — keeps each photo well under Vercel's 4.5 MB response limit
    const out = await sharp(source)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80 })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).send(out);
  } catch (error) {
    console.error("wo-photo error:", error);
    return res.status(500).json({ error: "Could not load the photo" });
  }
}
