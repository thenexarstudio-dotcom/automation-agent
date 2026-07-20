# Consultant Client Ops

A digital-products portfolio business for the freelance/consulting niche: an SEO-driven static site selling document templates and an ebook through Gumroad, with free client-side calculators as the traffic engine and an AI chat widget handling support.

**Stack:** Astro 5 + Tailwind + Preact islands · Netlify (hosting) · Gumroad checkout · Chatbase-style chat widget · Plausible analytics

**Domain:** currently `consultant-client-ops.netlify.app` — a free subdomain claimed when the site is connected on Netlify, not a purchased domain. A custom domain can be pointed at the same Netlify site later without changing anything else about the stack (see step 1 below).

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
src/content/templates/    SEO landing pages, one per Kit document (16)
src/content/tools/        Landing pages for the free calculators (4)
src/content/blog/         Long-tail SEO posts (13)
src/content/comparisons/  "X alternative" pages (3)
src/content/faq/          FAQ corpus — feeds on-page accordions AND the chat widget's training data
src/islands/              The interactive calculators (Preact)
src/data/products.json    Single source of truth for Gumroad slugs + prices
product-source/           The actual sellable files: kit markdown+PDFs+zip, ebook, covers
docs/launch/              Copy-paste-ready Gumroad listings, Product Hunt kit, community posts, receipt emails
docs/keyword-map.csv      Target keyword → page mapping; keep current as the catalog grows
```

## Launch checklist (in order)

1. **Netlify** — create a free account, connect this repo. `netlify.toml` at the repo root already sets the build command (`npm run build`) and publish dir (`dist`), so Netlify auto-detects everything. Claim the site name `consultant-client-ops` if you can (that's what `astro.config.mjs`'s `site` field currently assumes) — if it's taken, Netlify will offer an alternate; update the one `site` line in `astro.config.mjs` to match whatever you actually claimed, then re-run `npm run build:deliverables` + `node scripts/render-covers.mjs` so the branded PDFs/covers/OG image pick up the real URL. `robots.txt` and `sitemap-index.xml` are generated from that same `site` value, so they never drift.
2. **Custom domain (optional, later)** — when you're ready to move off the free subdomain, buy one and point it at the same Netlify site (Netlify handles the DNS/SSL); update `astro.config.mjs` `site` again and rebuild.
3. **Gumroad** — create both products using `docs/launch/gumroad-*.md` (copy, price, covers from `product-source/covers/`). Upload `product-source/consultant-client-ops-kit/consultant-client-ops-kit.zip` and `product-source/feast-or-famine-fix-ebook/feast-or-famine-fix.pdf`. Set the receipt messages from `docs/launch/post-purchase-emails.md`. Then update `gumroadSlug` values in `src/data/products.json` to the real permalinks and redeploy.
4. **Test purchase** — buy the Kit yourself end-to-end; confirm the zip downloads and the receipt message renders.
5. **Chat widget** — create a Chatbase (or similar) bot; upload everything under `src/content/faq/` as training data; set `PUBLIC_CHATBOT_ID` in Netlify's environment variables; redeploy.
6. **Analytics** — set `PUBLIC_PLAUSIBLE_DOMAIN` in Netlify's environment variables (or swap `src/components/Analytics.astro` for GA4).
7. **Search engines** — verify the domain in Google Search Console + Bing Webmaster Tools; submit `https://<your-site>.netlify.app/sitemap-index.xml`; request indexing on the pillar page, the 4 tool pages, and the top 5 template pages.
8. **Seed traffic** — work through `docs/launch/community-seed-posts.md` (one community per day), then schedule the Product Hunt launch per `docs/launch/product-hunt-launch.md`.
9. **Legal pass** — have a lawyer review the Service Agreement, Retainer Agreement, and NDA templates (and the site's Terms) before ad spend or meaningful volume.

## Autonomous content engine

A scheduled Routine runs one iteration of the content loop each week: it drafts the next batch from `docs/content-backlog.json` (using sonnet sub-agents for drafting, opus-class judgment for review/integration), gates on a green `check`/`build`/link-check, and commits only if everything passes. Full runbook and how to pause/stop/re-cadence it: `docs/content-engine.md`. Steer it by editing the backlog JSON.

## Content cadence after launch (the growth engine)

- **Months 1–2:** 2–3 new SEO pages/week (template landing pages and blog posts), 1 new sellable product every 2–3 weeks. Deepen this niche before adding another.
- **Months 3–4:** launch niche #2 (Small-Business Hiring & People Ops) on the same infrastructure.
- **Months 5–6:** higher-ticket bundle, email-gate the top calculators to build a list, begin light backlink outreach. Review Search Console monthly: double down on pages that rank, rewrite ones with no impressions after ~90 days.

## Maintenance notes

- Editing a Kit document? Change the markdown in `product-source/consultant-client-ops-kit/`, run `npm run build:deliverables`, re-upload the zip to Gumroad.
- Adding a template? Create both the landing page (`src/content/templates/`) and the deliverable (`product-source/.../NN-slug.md`), add it to `kitDocs` in `scripts/build-deliverables.mjs`. Document-count copy is dynamic on the homepage and numberless everywhere else, so it never needs a manual update — except the two spots in `docs/launch/gumroad-kit-listing.md` (headline count + numbered list), which the content-engine runbook (`docs/content-engine.md`) accounts for.
- npm audit currently flags Astro advisories fixed only in astro@7 (breaking). They target SSR/user-content scenarios this fully-static site doesn't have, and the one locally-relevant vector (`define:vars`) has been removed. Revisit the astro@7 upgrade deliberately, not via `audit fix --force`.
