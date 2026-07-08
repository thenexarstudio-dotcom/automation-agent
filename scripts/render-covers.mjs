// Renders 1280x720 Gumroad product cover images for the Kit and the ebook
// using the pre-installed Chromium. Output: product-source/covers/*.png
// Run: PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/render-covers.mjs
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseCss = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px; height: 720px;
    background: linear-gradient(160deg, #0f1115 0%, #171a21 60%, #1c2029 100%);
    font-family: Georgia, "Source Serif 4", serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 90px; position: relative; overflow: hidden;
  }
  .accent {
    position: absolute; top: -140px; right: -140px;
    width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(circle, rgba(193,127,46,0.35) 0%, rgba(193,127,46,0) 70%);
  }
  .kicker {
    font-family: Arial, sans-serif; text-transform: uppercase;
    letter-spacing: 2px; color: #d99a4e; font-size: 20px; font-weight: 600; margin-bottom: 20px;
  }
  h1 { color: #f6f7f9; font-size: 60px; line-height: 1.12; max-width: 950px; }
  .sub { margin-top: 24px; color: #a7acb8; font-size: 26px; max-width: 820px; line-height: 1.4; }
  .rule { width: 90px; height: 4px; background: #c17f2e; margin-top: 30px; }
  .foot {
    position: absolute; bottom: 56px; left: 90px;
    color: #636a78; font-family: Arial, sans-serif; font-size: 20px;
  }
  .price {
    position: absolute; bottom: 48px; right: 90px;
    font-family: Arial, sans-serif; font-weight: 700; font-size: 26px;
    color: #0f1115; background: #d99a4e; border-radius: 10px; padding: 12px 22px;
  }
`;

const covers = [
  {
    file: "kit-cover.png",
    html: `<div class="accent"></div>
      <p class="kicker">12 documents &middot; PDF + editable markdown</p>
      <h1>The Consultant Client Ops Kit</h1>
      <p class="sub">Every client document from first proposal to final invoice — done, so you never start from a blank page again.</p>
      <div class="rule"></div>
      <p class="foot">consultantclientops.com</p>
      <p class="price">$39</p>`,
  },
  {
    file: "ebook-cover.png",
    html: `<div class="accent"></div>
      <p class="kicker">Ebook &middot; 5 chapters, zero fluff</p>
      <h1>The Feast-or-Famine Fix</h1>
      <p class="sub">A freelancer's system for pricing, proposals, and a predictable client pipeline.</p>
      <div class="rule"></div>
      <p class="foot">consultantclientops.com</p>
      <p class="price">$19</p>`,
  },
];

await mkdir("product-source/covers", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const c of covers) {
  await page.setContent(`<!doctype html><html><head><style>${baseCss}</style></head><body>${c.html}</body></html>`, { waitUntil: "load" });
  await page.screenshot({ path: `product-source/covers/${c.file}` });
  console.log(`Rendered product-source/covers/${c.file}`);
}
await browser.close();
