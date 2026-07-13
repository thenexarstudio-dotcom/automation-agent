import type { APIContext } from "astro";
import { getCollection } from "astro:content";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, "") ?? "";
  const posts = (await getCollection("blog")).sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.data.publishDate).toUTCString()}</pubDate>
      <description>${esc(p.data.seoDescription)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Consultant Client Ops — Blog</title>
    <link>${site}</link>
    <description>Practical guides on pricing, proposals, scope, and client operations for freelancers and consultants.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
