import type { APIContext } from "astro";

// Generated from astro.config `site`, so swapping the production domain is a
// single change there — no static robots.txt to keep in sync.
export function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, "") ?? "";
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
