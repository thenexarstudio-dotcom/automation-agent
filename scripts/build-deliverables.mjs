// Renders every product-source markdown deliverable to PDF, then zips the
// 8 Kit documents into a single Gumroad-upload-ready archive.
// Run: PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/build-deliverables.mjs
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readdir } from "node:fs/promises";

const run = promisify(execFile);

const KIT_DIR = "product-source/consultant-client-ops-kit";
const EBOOK_DIR = "product-source/feast-or-famine-fix-ebook";

const kitDocs = [
  ["01-consulting-proposal-template", "Consulting Proposal Template"],
  ["02-scope-of-work-template", "Scope of Work Template"],
  ["03-service-agreement-template", "Service Agreement Template"],
  ["04-client-onboarding-questionnaire", "Client Onboarding Questionnaire"],
  ["05-change-order-template", "Change Order Template"],
  ["06-invoice-template", "Invoice Template"],
  ["07-offboarding-checklist", "Offboarding Checklist"],
  ["08-rate-card-template", "Rate Card Template"],
  ["09-retainer-agreement-template", "Retainer Agreement Template"],
  ["10-project-kickoff-checklist", "Project Kickoff Checklist"],
  ["11-testimonial-referral-request-scripts", "Testimonial & Referral Request Scripts"],
  ["12-weekly-client-update-template", "Weekly Client Update Template"],
];

async function renderAll() {
  await mkdir(`${KIT_DIR}/pdf`, { recursive: true });
  for (const [slug, title] of kitDocs) {
    await run("node", [
      "scripts/render-pdf.mjs",
      `${KIT_DIR}/${slug}.md`,
      `${KIT_DIR}/pdf/${slug}.pdf`,
      title,
    ]);
  }
  await run("node", [
    "scripts/render-pdf.mjs",
    `${EBOOK_DIR}/manuscript.md`,
    `${EBOOK_DIR}/feast-or-famine-fix.pdf`,
    "The Feast-or-Famine Fix",
  ]);
}

async function zipKit() {
  const zipPath = `${KIT_DIR}/consultant-client-ops-kit.zip`;
  const files = (await readdir(`${KIT_DIR}/pdf`)).filter((f) => f.endsWith(".pdf"));
  await run("zip", ["-j", "-X", zipPath, ...files.map((f) => `${KIT_DIR}/pdf/${f}`)]);
  console.log(`Zipped ${zipPath}`);
}

await renderAll();
await zipKit();
await run("node", ["scripts/render-og.mjs"]);
console.log("Done.");
