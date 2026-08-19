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
  ["13-discovery-call-script", "Discovery Call Script"],
  ["14-project-completion-report", "Project Completion Report"],
  ["15-freelance-nda-template", "Freelance NDA Template"],
  ["16-late-payment-reminder-emails", "Late Payment Reminder Email Templates"],
  ["17-freelance-quote-template", "Freelance Quote Template"],
  ["18-project-brief-template", "Project Brief Template"],
  ["19-milestone-payment-schedule-template", "Milestone Payment Schedule Template"],
  ["20-kill-fee-clause-template", "Kill Fee Clause Template"],
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
    "A freelancer's system for pricing, proposals, and a predictable client pipeline.",
  ]);
}

// Buyers get both formats: print-ready PDFs plus the editable markdown
// sources (which import natively into Notion and Google Docs — the START-HERE
// doc explains how). Zip layout: START-HERE.md at root, pdf/ and markdown/ dirs.
async function zipKit() {
  const zipPath = "consultant-client-ops-kit.zip";
  const stage = "consultant-client-ops-kit";
  await run("rm", ["-rf", stage, `${KIT_DIR}/${zipPath}`]);
  await mkdir(`${stage}/pdf`, { recursive: true });
  await mkdir(`${stage}/markdown`, { recursive: true });
  await run("cp", [`${KIT_DIR}/START-HERE.md`, `${stage}/START-HERE.md`]);
  for (const f of (await readdir(`${KIT_DIR}/pdf`)).filter((f) => f.endsWith(".pdf"))) {
    await run("cp", [`${KIT_DIR}/pdf/${f}`, `${stage}/pdf/${f}`]);
  }
  for (const [slug] of kitDocs) {
    await run("cp", [`${KIT_DIR}/${slug}.md`, `${stage}/markdown/${slug}.md`]);
  }
  await run("zip", ["-r", "-X", `${KIT_DIR}/${zipPath}`, stage]);
  await run("rm", ["-rf", stage]);
  console.log(`Zipped ${KIT_DIR}/${zipPath}`);
}

await renderAll();
await zipKit();
await run("node", ["scripts/render-og.mjs"]);
console.log("Done.");
