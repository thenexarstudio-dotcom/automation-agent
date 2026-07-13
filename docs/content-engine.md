# Autonomous Content Engine

This is the feedback loop that keeps the catalog growing toward the traffic the revenue target needs — without a human in the loop for each batch. A scheduled Routine fires weekly and runs **one iteration** of the loop below, using the right model for each step, and only commits if the build is green.

## The model-per-step principle

- **Drafting** (volume content: template pages, deliverables, blog posts) → **sonnet** sub-agents. Good quality, cost-appropriate for content at volume.
- **Review, integration, and the commit gate** (judgment) → the **orchestrator** session (opus-class) doing it directly.

This keeps the expensive judgment model on the decisions that matter and the cheaper model on the drafting.

## One iteration (what the Routine executes)

1. **Sync.** On the repo, `git fetch origin` and check out `claude/digital-products-portfolio-90bh6x` (create from `origin/<default>` if the prior PR already merged — see the git rules in the repo's session guidance). Pull latest.
2. **Pick the batch.** Read `docs/content-backlog.json`; take the first batch with `"status": "pending"`. If none are pending, do **not** invent filler — write a short note (and, once Search Console data exists, propose new batches from real queries) and stop without committing.
3. **Draft (sonnet sub-agents).** Spawn one sub-agent per content type (templates, posts, comparisons, tools) with `model: "sonnet"`, each strictly scoped to *new files only*, told **not** to run builds. Give them the exact zod schema (`src/content/config.ts`) and 2–3 existing files to match voice. Follow the same prompt shape that worked before (see git history of this loop's commits).
4. **Integrate (orchestrator).** For any new Kit template: add its `NN-slug` to `kitDocs` in `scripts/build-deliverables.mjs`, add the landing page + deliverable, and append the pages to `docs/keyword-map.csv`. Add new tools to `src/pages/tools/[slug].astro`. If the Kit document count changed, update the two remaining manual count touchpoints — `docs/launch/gumroad-kit-listing.md` (headline number + the numbered document list) — everything else is numberless or dynamic and needs no edit.
5. **Regenerate deliverables** only if the Kit changed: `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run build:deliverables`.
6. **QA gate (orchestrator).** Run, in order:
   - `npm run check` → must be **0 errors**.
   - `npm run build` → must complete.
   - the broken-link + JSON-LD validation script (inline python used in this loop's commits) → **0 broken links, 0 invalid JSON-LD**.
   - a dedupe check: no new slug may collide with an existing one, and new titles/keywords must not duplicate existing pages.
   If any check fails, **fix it or discard the offending file** — never commit a red tree.
7. **Flip the backlog.** Set the consumed batch's `"status"` to `"done"` and bump `existing_snapshot`.
8. **Commit + push** the batch (only if step 6 is fully green), to the feature branch. One commit per iteration, descriptive message.
9. **Report.** The Routine's completion notification summarizes what shipped (or why it stopped).

## Guardrails

- **Quality over volume.** Cap each run at ~4 new pages. Thin/duplicate content hurts SEO more than slow growth helps it.
- **Green-only commits.** A failing `check`/`build`/link-check means commit nothing.
- **No account-gated actions.** The loop never touches Gumroad, DNS, analytics, or deploy config — those stay with the human (see README).
- **Legal-sensitive templates** (contracts, NDAs, clauses) always carry the "starting point, not legal advice" disclaimer.

## How to control the loop

- **Pause:** disable the Routine (it stays saved). **Resume:** re-enable it.
- **Stop for good:** delete the Routine.
- **Change cadence or batches:** edit the cron on the Routine, or edit `docs/content-backlog.json`.
- The Routine sends a push/email summary after each run, so you always see what it did and can steer the backlog.

## Live Routine

- **Trigger id:** `trig_01EMCF4c8qLDKHNJJpCfFoH2`
- **Cadence:** weekly — Mondays 09:00 UTC (`0 9 * * 1`)
- **Mode:** fresh session per fire, commits to `claude/digital-products-portfolio-90bh6x`
- **Notifications:** push + email summary after every run
- **Pause:** disable trigger `trig_01EMCF4c8qLDKHNJJpCfFoH2` · **Stop:** delete it · **Run now:** fire it on demand · **Re-cadence:** update its cron. (Ask this assistant, or use the Routines controls in your client.)
