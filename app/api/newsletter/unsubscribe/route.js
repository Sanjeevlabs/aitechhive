import {
  newsletterStore,
  tokenHash,
  sameOrigin,
} from "../../../../lib/newsletter-store";
export const runtime = "nodejs";
export async function POST(request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request." }, { status: 403 });
  let token;
  try {
    const raw = await request.text();
    if (raw.length > 256) throw Error();
    token = JSON.parse(raw).token;
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token))
      throw Error();
  } catch {
    return Response.json(
      { error: "Invalid cancellation link." },
      { status: 400 },
    );
  }
  const store = newsletterStore();
  if (!store)
    return Response.json(
      {
        error:
          "Cancellation is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  try {
    const { error } = await store.db
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("unsubscribe_token_hash", tokenHash(token));
    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Cancellation is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
