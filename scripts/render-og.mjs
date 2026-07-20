// Renders the default 1200x630 OG/social share image using the same
// pre-installed Chromium as render-pdf.mjs. Run:
// PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/render-og.mjs
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const html = `<!doctype html>
<html><head><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: linear-gradient(160deg, #0f1115 0%, #171a21 60%, #1c2029 100%);
    font-family: Georgia, "Source Serif 4", serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 90px;
    position: relative;
    overflow: hidden;
  }
  .accent {
    position: absolute; top: -120px; right: -120px;
    width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle, rgba(193,127,46,0.35) 0%, rgba(193,127,46,0) 70%);
  }
  .kicker {
    font-family: Arial, sans-serif;
    text-transform: uppercase; letter-spacing: 2px;
    color: #d99a4e; font-size: 20px; font-weight: 600; margin-bottom: 22px;
  }
  h1 { color: #f6f7f9; font-size: 58px; line-height: 1.15; max-width: 920px; }
  .rule { width: 90px; height: 4px; background: #c17f2e; margin-top: 34px; }
  .foot { position: absolute; bottom: 60px; left: 90px; color: #a7acb8; font-family: Arial, sans-serif; font-size: 22px; }
</style></head>
<body>
  <div class="accent"></div>
  <p class="kicker">For freelancers &amp; independent consultants</p>
  <h1>Run client work like a business, not a favor.</h1>
  <div class="rule"></div>
  <p class="foot">consultant-client-ops.netlify.app</p>
</body></html>`;

await mkdir("public/og", { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: "public/og/default.png" });
await browser.close();

console.log("Rendered public/og/default.png");
