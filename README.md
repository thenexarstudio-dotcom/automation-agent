# Consultant Client Ops

A digital-products portfolio business for the freelance/consulting niche: an SEO-driven static site selling document templates and an ebook through Gumroad, with free client-side calculators as the traffic engine and an AI chat widget handling support.

**Stack:** Astro 5 + Tailwind + Preact islands · Cloudflare Pages · Gumroad checkout · Chatbase-style chat widget · Plausible analytics

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Build the static site to `dist/` |
| `npm run check` | Typecheck (`astro check`) |
| `npm run build:deliverables` | Re-render all product PDFs, rebuild the Kit zip, regenerate the OG image (needs `PLAYWRIGHT_CHROMIUM_PATH` pointing at a Chromium binary) |
| `node scripts/render-covers.mjs` | Regenerate the Gumroad cover PNGs |

## Where things live

```
src/content/templates/    SEO landing pages, one per Kit document (12)
src/content/tools/        Landing pages for the free calculators (4)
src/content/blog/         Long-tail SEO posts (10)
src/content/comparisons/  "X alternative" pages (3)
src/content/faq/          FAQ corpus — feeds on-page accordions AND the chat widget's training data
src/islands/              The interactive calculators (Preact)
src/data/products.json    Single source of truth for Gumroad slugs + prices
product-source/           The actual sellable files: kit markdown+PDFs+zip, ebook, covers
docs/launch/              Copy-paste-ready Gumroad listings, Product Hunt kit, community posts, receipt emails
docs/keyword-map.csv      Target keyword → page mapping; keep current as the catalog grows
```

## Launch checklist (in order)

1. **Domain** — buy one; replace `consultantclientops.com` in `astro.config.mjs` (the `site` field), `public/robots.txt`, and re-run `npm run build:deliverables` + `node scripts/render-covers.mjs` so the branded assets pick it up. Grep for the old domain to catch stragglers.
2. **Cloudflare Pages** — connect this repo; build command `npm run build`, output `dist`. The `public/_headers` security headers deploy automatically.
3. **Gumroad** — create both products using `docs/launch/gumroad-*.md` (copy, price, covers from `product-source/covers/`). Upload `product-source/consultant-client-ops-kit/consultant-client-ops-kit.zip` and `product-source/feast-or-famine-fix-ebook/feast-or-famine-fix.pdf`. Set the receipt messages from `docs/launch/post-purchase-emails.md`. Then update `gumroadSlug` values in `src/data/products.json` to the real permalinks and redeploy.
4. **Test purchase** — buy the Kit yourself end-to-end; confirm the zip downloads and the receipt message renders.
5. **Chat widget** — create a Chatbase (or similar) bot; upload everything under `src/content/faq/` as training data; set `PUBLIC_CHATBOT_ID` in Cloudflare Pages env vars; redeploy.
6. **Analytics** — set `PUBLIC_PLAUSIBLE_DOMAIN` in Pages env vars (or swap `src/components/Analytics.astro` for GA4).
7. **Search engines** — verify the domain in Google Search Console + Bing Webmaster Tools; submit `https://<domain>/sitemap-index.xml`; request indexing on the pillar page, the 4 tool pages, and the top 5 template pages.
8. **Seed traffic** — work through `docs/launch/community-seed-posts.md` (one community per day), then schedule the Product Hunt launch per `docs/launch/product-hunt-launch.md`.
9. **Legal pass** — have a lawyer review the Service Agreement and Retainer Agreement templates (and the site's Terms) before ad spend or meaningful volume.

## Content cadence after launch (the growth engine)

- **Months 1–2:** 2–3 new SEO pages/week (template landing pages and blog posts), 1 new sellable product every 2–3 weeks. Deepen this niche before adding another.
- **Months 3–4:** launch niche #2 (Small-Business Hiring & People Ops) on the same infrastructure.
- **Months 5–6:** higher-ticket bundle, email-gate the top calculators to build a list, begin light backlink outreach. Review Search Console monthly: double down on pages that rank, rewrite ones with no impressions after ~90 days.

## Maintenance notes

- Editing a Kit document? Change the markdown in `product-source/consultant-client-ops-kit/`, run `npm run build:deliverables`, re-upload the zip to Gumroad.
- Adding a template? Create both the landing page (`src/content/templates/`) and the deliverable (`product-source/.../NN-slug.md`), add it to `kitDocs` in `scripts/build-deliverables.mjs`, and update the document-count copy sitewide (grep for "12 documents").
- npm audit currently flags Astro advisories fixed only in astro@7 (breaking). They target SSR/user-content scenarios this fully-static site doesn't have, and the one locally-relevant vector (`define:vars`) has been removed. Revisit the astro@7 upgrade deliberately, not via `audit fix --force`.
