// Renders on-brand paid-ad creatives (PNG) in the standard ad sizes using the
// pre-installed Chromium — no external image service needed. Output: product-source/ads/
// Run: PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/render-ads.mjs
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const URL = "consultant-client-ops.netlify.app";

function css(w, h) {
  const pad = Math.round(w * 0.08);
  return `
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${w}px; height:${h}px; overflow:hidden; position:relative;
    background: linear-gradient(160deg,#0f1115 0%,#171a21 60%,#1c2029 100%);
    font-family: Georgia, "Source Serif 4", serif;
    display:flex; flex-direction:column; justify-content:flex-start;
    padding:${pad}px;
  }
  .accent { position:absolute; top:${-w*0.14}px; right:${-w*0.14}px;
    width:${w*0.5}px; height:${w*0.5}px; border-radius:50%;
    background: radial-gradient(circle, rgba(193,127,46,0.38) 0%, rgba(193,127,46,0) 70%); }
  .kicker { font-family:Arial,sans-serif; text-transform:uppercase; letter-spacing:2px;
    color:#d99a4e; font-weight:700; font-size:${Math.round(w*0.026)}px; margin-bottom:${Math.round(h*0.03)}px; }
  h1 { color:#f6f7f9; font-size:${Math.round(Math.min(w*0.072, h*0.12))}px; line-height:1.08; max-width:92%; }
  .sub { margin-top:${Math.round(h*0.03)}px; color:#a7acb8; font-size:${Math.round(Math.min(w*0.032, h*0.05))}px; line-height:1.4; max-width:88%; }
  .rule { width:${Math.round(w*0.09)}px; height:${Math.max(3,Math.round(w*0.006))}px; background:#c17f2e; margin-top:${Math.round(h*0.035)}px; }
  .cta { margin-top:auto; padding-top:${Math.round(h*0.04)}px; display:flex; align-items:center; gap:${Math.round(w*0.02)}px; flex-wrap:wrap; }
  .btn { font-family:Arial,sans-serif; font-weight:700; font-size:${Math.round(w*0.03)}px;
    color:#0f1115; background:#d99a4e; border-radius:${Math.round(w*0.014)}px; padding:${Math.round(h*0.018)}px ${Math.round(w*0.035)}px; }
  .url { font-family:Arial,sans-serif; font-size:${Math.round(w*0.024)}px; color:#636a78; }
  .badge { position:absolute; top:${pad}px; right:${pad}px; font-family:Arial,sans-serif; font-weight:700;
    font-size:${Math.round(w*0.03)}px; color:#0f1115; background:#f6f7f9; border-radius:${Math.round(w*0.014)}px;
    padding:${Math.round(h*0.014)}px ${Math.round(w*0.03)}px; }
  `;
}

function html(a) {
  return `<!doctype html><html><head><style>${css(a.w, a.h)}</style></head><body>
    <div class="accent"></div>
    ${a.badge ? `<div class="badge">${a.badge}</div>` : ""}
    <p class="kicker">${a.kicker}</p>
    <h1>${a.headline}</h1>
    ${a.sub ? `<p class="sub">${a.sub}</p>` : ""}
    <div class="rule"></div>
    <div class="cta"><span class="btn">${a.cta}</span><span class="url">${URL}</span></div>
  </body></html>`;
}

// Concepts grounded in real product features (no invented claims).
const concepts = {
  kit: {
    kicker: "For freelancers &amp; consultants",
    headline: "20 done-for-you client documents.",
    sub: "Proposal, contract, scope of work, invoice, retainer &amp; more. PDF + editable markdown.",
    cta: "Get the Kit", badge: "$39 once",
  },
  freebie: {
    kicker: "Free · no signup",
    headline: "Know your real freelance day rate.",
    sub: "A free calculator + a one-page pricing &amp; proposal cheatsheet. Nothing to install.",
    cta: "Get the free toolkit",
  },
  scopecreep: {
    kicker: "Freelance reality check",
    headline: "“Just one more small thing.”",
    sub: "See what unbilled scope creep actually costs you — free calculator.",
    cta: "Run the numbers",
  },
  rebuild: {
    kicker: "Stop starting from a blank page",
    headline: "Never rebuild a proposal from scratch again.",
    sub: "Every client document from first proposal to final invoice — done.",
    cta: "See the Kit", badge: "$39 once",
  },
};

// size presets
const S = {
  sq: { w: 1080, h: 1080 },        // Meta/IG square
  pt: { w: 1080, h: 1350 },        // Meta/IG 4:5 portrait
  li: { w: 1200, h: 627 },         // LinkedIn / FB link
};

const ads = [
  { file: "ad-kit-square.png", ...S.sq, ...concepts.kit },
  { file: "ad-kit-portrait.png", ...S.pt, ...concepts.kit },
  { file: "ad-freebie-square.png", ...S.sq, ...concepts.freebie },
  { file: "ad-freebie-portrait.png", ...S.pt, ...concepts.freebie },
  { file: "ad-scopecreep-square.png", ...S.sq, ...concepts.scopecreep },
  { file: "ad-rebuild-linkedin.png", ...S.li, ...concepts.rebuild },
  { file: "ad-freebie-linkedin.png", ...S.li, ...concepts.freebie },
];

await mkdir("product-source/ads", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH });
for (const a of ads) {
  const page = await browser.newPage({ viewport: { width: a.w, height: a.h } });
  await page.setContent(html(a), { waitUntil: "load" });
  await page.screenshot({ path: `product-source/ads/${a.file}` });
  await page.close();
  console.log(`Rendered product-source/ads/${a.file} (${a.w}x${a.h})`);
}
await browser.close();
