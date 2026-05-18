import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Do NOT use `export const runtime = "edge"` here.
// The Edge runtime silently drops cookies().set() calls, so exchangeCodeForSession()
// would create a session server-side but never write the auth cookies to the browser.
// Node.js runtime is required for the cookie exchange to work.

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // On Vercel, `origin` is the internal edge URL. x-forwarded-host is the real public hostname.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const base = forwardedHost ? `https://${forwardedHost}` : origin;
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  // Missing code or exchange failed — redirect with an error flag the client can surface.
  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
