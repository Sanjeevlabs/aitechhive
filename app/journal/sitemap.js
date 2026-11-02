import { posts } from "./lib/posts";
export default function sitemap() {
  const origin = "https://newsletter.aitechhive.com";
  return [
    { url: origin },
    { url: origin + "/archive" },
    ...posts.map((p) => ({
      url: origin + "/p/" + p.slug,
      lastModified: p.date,
    })),
  ];
}
