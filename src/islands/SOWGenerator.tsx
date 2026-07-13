import { useMemo, useState } from "preact/hooks";

function todayStr() {
  return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function SOWGenerator() {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [timeline, setTimeline] = useState("");
  const [exclusions, setExclusions] = useState("");

  const doc = useMemo(() => {
    const deliverableLines = deliverables
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `  - ${l}`)
      .join("\n");
    const exclusionLines = exclusions
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `  - ${l}`)
      .join("\n");

    return `SCOPE OF WORK
Prepared: ${todayStr()}

Client: ${clientName || "[Client Name]"}
Project: ${projectName || "[Project Name]"}

DELIVERABLES
${deliverableLines || "  - [add deliverables above]"}

TIMELINE
  ${timeline || "[add timeline above]"}

EXPLICITLY OUT OF SCOPE
${exclusionLines || "  - [add exclusions above]"}

REVISIONS
  Two rounds of revisions per deliverable are included. Additional rounds
  billed at standard rate or handled via a Change Order.

CHANGE PROCESS
  Any request outside the deliverables above will be scoped and priced
  in writing via a Change Order before work begins.
`;
  }, [clientName, projectName, deliverables, timeline, exclusions]);

  function download() {
    const blob = new Blob([doc], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scope-of-work-${(projectName || "draft").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div class="grid sm:grid-cols-2 gap-5">
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Client name</span>
          <input
            type="text"
            value={clientName}
            onInput={(e) => setClientName((e.target as HTMLInputElement).value)}
            placeholder="Acme Co."
            class="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 outline-none text-ink-950"
          />
        </label>
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Project name</span>
          <input
            type="text"
            value={projectName}
            onInput={(e) => setProjectName((e.target as HTMLInputElement).value)}
            placeholder="Q3 brand refresh"
            class="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 outline-none text-ink-950"
          />
        </label>
        <label class="block sm:col-span-2">
          <span class="text-sm font-medium text-ink-700">Deliverables (one per line)</span>
          <textarea
            value={deliverables}
            onInput={(e) => setDeliverables((e.target as HTMLTextAreaElement).value)}
            placeholder={"Brand guidelines document (12 pages)\nLogo suite (primary + 2 variants)"}
            rows={4}
            class="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 outline-none text-ink-950"
          />
        </label>
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Timeline</span>
          <input
            type="text"
            value={timeline}
            onInput={(e) => setTimeline((e.target as HTMLInputElement).value)}
            placeholder="4 weeks from kickoff, delivered in 2 phases"
            class="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 outline-none text-ink-950"
          />
        </label>
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Explicitly out of scope (one per line)</span>
          <textarea
            value={exclusions}
            onInput={(e) => setExclusions((e.target as HTMLTextAreaElement).value)}
            placeholder={"Paid media strategy\nWebsite development"}
            rows={4}
            class="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 outline-none text-ink-950"
          />
        </label>
      </div>

      <div class="mt-6">
        <p class="text-sm font-medium text-ink-700 mb-2">Preview</p>
        <pre class="whitespace-pre-wrap text-xs bg-ink-950 text-ink-100 rounded-lg p-4 overflow-x-auto max-h-72 overflow-y-auto">{doc}</pre>
        <button
          onClick={download}
          class="mt-4 rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-900"
        >
          Download as .txt
        </button>
      </div>
      <p class="mt-4 text-xs text-ink-500">
        This is a basic single-document draft. The full Scope of Work Template (in the Kit) adds assumptions, dependency
        tracking, and contract-ready formatting across the whole document library.
      </p>
    </div>
  );
}
