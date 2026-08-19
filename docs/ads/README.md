# Ad ops — start here

Everything needed to run paid ads for Consultant Client Ops. **Nothing here spends money on its own** — these are the assets and instructions; you launch the campaigns from your own ad accounts.

## The one rule: funnel before ads

An ad that sends traffic to a checkout that isn't live is money set on fire. Before spending a cent, confirm the full path works end to end:

1. Site is live on Netlify (production branch = `main`) and renders.
2. Gumroad products exist and `src/data/products.json` has the **real** permalinks (not the placeholder slugs) — do a real test purchase.
3. `/free-toolkit` loads, the email form submits, `/thank-you` shows and the cheatsheet downloads. In Netlify, confirm **Forms** is enabled and a `lead-magnet` form appears after the first deploy (Netlify detects it from the deployed HTML).

Only then turn on spend.

## The two funnels (both are built)

- **Direct:** ad → template/product page → Gumroad `$39` checkout. Fastest, but cold-to-$39 is hard to make ROI-positive; treat as a test, keep budgets small, lean on retargeting.
- **Lead magnet:** ad → `/free-toolkit` → email capture (Netlify Forms) → `/thank-you` + free cheatsheet. Better economics on cold traffic. Emails collect in Netlify now; connect an ESP later (Mailchimp/ConvertKit/Buttondown) to automate a nurture sequence toward the Kit. Until then, export/nurture manually.

## Copy (ready to paste)

- `google-search.md` — 4 ad groups, RSA headlines/descriptions (within char limits), keywords + negatives, per-group landing-page routing.
- `meta.md` — 3 concepts, primary text variants, headlines, CTAs, audience targeting.
- `linkedin.md` — 2 concepts, higher-CPC note, job-title/skill targeting (recommend the lead-magnet path).

## Creatives (ready to upload)

In `product-source/ads/` (regenerate any time with `node scripts/render-ads.mjs`):

| File | Size | Use |
|---|---|---|
| `ad-kit-square.png` | 1080×1080 | Meta/IG feed — direct ($39 Kit) |
| `ad-kit-portrait.png` | 1080×1350 | Meta/IG feed/stories — direct |
| `ad-freebie-square.png` | 1080×1080 | Meta/IG — lead magnet |
| `ad-freebie-portrait.png` | 1080×1350 | Meta/IG — lead magnet |
| `ad-scopecreep-square.png` | 1080×1080 | Meta/IG — pain-hook to free tool |
| `ad-rebuild-linkedin.png` | 1200×627 | LinkedIn/FB link — direct |
| `ad-freebie-linkedin.png` | 1200×627 | LinkedIn/FB link — lead magnet |

All claims are grounded in real product features — no invented testimonials, ratings, or counts. Keep it that way when you edit.

## Honest expectation on economics

At a $39 one-time price and cold traffic, per-sale ad math is tight: Google Search in this niche can run $1–3+ per click, so even a 2–3% landing-page-to-purchase rate implies ~$40–150 spend per direct sale. That's why the lead-magnet path exists — capture the email cheaply, sell over time, and add a higher-ticket bundle later to lift average order value. Start with **small daily budgets** ($10–20/channel), measure cost-per-lead and cost-per-sale for ~1–2 weeks, then scale only what clears your target. Google Search (highest intent) is the best first bet; Meta lead-magnet second; LinkedIn last (most expensive).

## Suggested first-week test

- Google Search: the "contract template" + "proposal template" ad groups → direct product pages; the "calculator" ad group → `/free-toolkit`. ~$15/day.
- Meta: `ad-freebie-square` + `ad-scopecreep-square` → `/free-toolkit`. ~$10/day.
- Hold LinkedIn until the cheaper channels show a working funnel.
