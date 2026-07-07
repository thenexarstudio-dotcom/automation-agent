// Renders a markdown deliverable to a branded PDF using the Chromium already
// installed for Playwright (PLAYWRIGHT_BROWSERS_PATH), so no browser download
// is required. Usage: node scripts/render-pdf.mjs <input.md> <output.pdf> [docTitle]
import { readFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { marked } from "marked";
import { chromium } from "playwright-core";

const [, , inputPath, outputPath, docTitle] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/render-pdf.mjs <input.md> <output.pdf> [docTitle]");
  process.exit(1);
}

const md = await readFile(inputPath, "utf-8");
const bodyHtml = marked.parse(md);

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
</style>
</head>
<body>
${bodyHtml}
<p class="footer-note">Consultant Client Ops Kit — consultantclientops.com — provided as a starting-point document, not legal advice.</p>
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
