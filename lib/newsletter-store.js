import { createClient } from "@supabase/supabase-js";
import { createHmac, createHash, randomBytes } from "node:crypto";
export function newsletterStore() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return {
    db: createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
    key,
  };
}
export const newToken = () => randomBytes(32).toString("hex");
export const tokenHash = (token) =>
  createHash("sha256").update(token).digest("hex");
export function rateBucket(request, key) {
  // Vercel overwrites x-vercel-forwarded-for with the connecting visitor IP.
  const ip =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return createHmac("sha256", key)
    .update(new Date().toISOString().slice(0, 10) + ":" + ip)
    .digest("hex");
}
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
