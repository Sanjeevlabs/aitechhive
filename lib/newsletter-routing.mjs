export function newsletterRoute(host, pathname) {
  if ((host || "").toLowerCase().split(":")[0] !== "newsletter.aitechhive.com")
    return null;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/journal-assets/") ||
    pathname.startsWith("/api/newsletter/") ||
    pathname === "/favicon.svg" ||
    pathname === "/icon.svg"
  )
    return null;
  if (pathname === "/journal" || pathname.startsWith("/journal/"))
    return { kind: "redirect", path: pathname.slice(8) || "/" };
  return {
    kind: "rewrite",
    path: "/journal" + (pathname === "/" ? "" : pathname),
  };
}
