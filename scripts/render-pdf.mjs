// Renders a markdown deliverable to a branded PDF using the Chromium already
// installed for Playwright (PLAYWRIGHT_BROWSERS_PATH), so no browser download
// is required.
// Usage: node scripts/render-pdf.mjs <input.md> <output.pdf> [docTitle] [coverSubtitle]
// When coverSubtitle is given, a full-page branded cover is prepended (used
// for the ebook; the one-page kit docs stay coverless).
import { readFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { marked } from "marked";
import { chromium } from "playwright-core";

const [, , inputPath, outputPath, docTitle, coverSubtitle] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/render-pdf.mjs <input.md> <output.pdf> [docTitle] [coverSubtitle]");
  process.exit(1);
}

const md = await readFile(inputPath, "utf-8");
const bodyHtml = marked.parse(md);

const coverHtml = coverSubtitle
  ? `<div class="cover">
       <p class="cover-kicker">Consultant Client Ops</p>
       <h1 class="cover-title">${docTitle}</h1>
       <div class="cover-rule"></div>
       <p class="cover-subtitle">${coverSubtitle}</p>
       <p class="cover-foot">consultant-client-ops.netlify.app</p>
     </div>`
  : "";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${docTitle ?? "Document"}</title>
<style>
  @page { size: Letter; margin: 22mm 20mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Georgia", "Source Serif 4", serif;
    color: #171a21;
    line-height: 1.55;
    font-size: 11.5pt;
  }
  h1 {
    font-size: 22pt;
    color: #0f1115;
    border-bottom: 2px solid #c17f2e;
    padding-bottom: 8px;
    margin-bottom: 18px;
  }
  h2 {
    font-size: 14pt;
    color: #0f1115;
    margin-top: 22px;
    margin-bottom: 8px;
    border-bottom: 1px solid #e7e9ee;
    padding-bottom: 4px;
  }
  h3 { font-size: 12pt; color: #0f1115; margin-top: 16px; }
  p { margin: 6px 0 10px; }
  hr { border: none; border-top: 1px solid #e7e9ee; margin: 16px 0; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; page-break-inside: avoid; }
  th, td { border: 1px solid #d7dbe2; padding: 6px 8px; text-align: left; font-size: 10.5pt; vertical-align: top; }
  th { background: #f6f7f9; }
  ul, ol { margin: 6px 0 12px; padding-left: 22px; }
  li { margin-bottom: 4px; }
  strong { color: #0f1115; }
  em { color: #8a5a1f; font-style: normal; }
  code { background: #f6f7f9; padding: 1px 4px; border-radius: 3px; font-size: 10pt; }
  .footer-note { margin-top: 30px; font-size: 9pt; color: #a7acb8; }
  .cover {
    height: 228mm;
    display: flex; flex-direction: column; justify-content: center;
    page-break-after: always;
    position: relative;
  }
  .cover-kicker {
    font-family: Arial, sans-serif; text-transform: uppercase;
    letter-spacing: 2px; color: #c17f2e; font-size: 11pt; font-weight: 600;
  }
  .cover-title {
    font-size: 34pt; line-height: 1.15; border: none; margin: 14px 0 0; padding: 0;
  }
  .cover-rule { width: 70px; height: 3px; background: #c17f2e; margin: 22px 0; }
  .cover-subtitle { font-size: 14pt; color: #3a3f4b; max-width: 130mm; line-height: 1.5; }
  .cover-foot {
    position: absolute; bottom: 10mm; left: 0;
    font-family: Arial, sans-serif; font-size: 10pt; color: #a7acb8;
  }
</style>
</head>
<body>
${coverHtml}
${bodyHtml}
<p class="footer-note">Consultant Client Ops — consultant-client-ops.netlify.app — provided as a starting-point document, not legal advice.</p>
</body>
</html>`;

await mkdir(dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({
  path: outputPath,
  format: "Letter",
  printBackground: true,
  margin: { top: "22mm", bottom: "22mm", left: "20mm", right: "20mm" },
});
await browser.close();

console.log(`Rendered ${outputPath}`);
