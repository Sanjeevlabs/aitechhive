import {
  newsletterStore,
  newToken,
  tokenHash,
  rateBucket,
  sameOrigin,
} from "../../../../lib/newsletter-store";
export const runtime = "nodejs";
export async function POST(request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request." }, { status: 403 });
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 2048) throw Error();
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return Response.json({ ok: true });
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    body.consent !== true
  )
    return Response.json(
      { error: "Enter a valid email and agree to receive working notes." },
      { status: 400 },
    );
  const store = newsletterStore();
  if (!store)
    return Response.json(
      {
        error: "Email signups are being connected. Please check back shortly.",
      },
      { status: 503 },
    );
  try {
    const token = newToken();
    const { data, error } = await store.db.rpc("newsletter_subscribe", {
      p_email: email,
      p_bucket: rateBucket(request, store.key),
      p_token_hash: tokenHash(token),
    });
    if (error) {
      console.error("Newsletter storage unavailable:", error.code);
      return Response.json(
        { error: "We could not save your signup. Please try again." },
        { status: 503 },
      );
    }
    if (data === "rate_limited")
      return Response.json(
        { error: "Too many requests. Please try again tomorrow." },
        { status: 429 },
      );
    return Response.json({
      ok: true,
      ...(data === "created"
        ? { unsubscribeUrl: "/journal/unsubscribe?token=" + token }
        : {}),
    });
  } catch {
    return Response.json(
      { error: "We could not save your signup. Please try again." },
      { status: 503 },
    );
  }
}
