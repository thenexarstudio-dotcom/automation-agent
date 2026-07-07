import { useMemo, useState } from "preact/hooks";

function formatUSD(n: number) {
  if (!isFinite(n) || n < 0) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function RetainerCalculator() {
  const [fee, setFee] = useState(3000);
  const [hours, setHours] = useState(25);
  const [targetRate, setTargetRate] = useState(120);

  const effectiveRate = useMemo(() => {
    if (hours <= 0) return null;
    return fee / hours;
  }, [fee, hours]);

  const gap = effectiveRate === null ? null : effectiveRate - targetRate;
  const gapPct = useMemo(() => {
    if (effectiveRate === null || targetRate <= 0) return null;
    return ((effectiveRate - targetRate) / targetRate) * 100;
  }, [effectiveRate, targetRate]);

  const verdict = useMemo(() => {
    if (effectiveRate === null) return { label: "Enter hours to see your verdict", tone: "neutral" as const };
    if (gap === null) return { label: "—", tone: "neutral" as const };
    if (gap > 0.5) return { label: "Above your target rate", tone: "good" as const };
    if (gap < -0.5) return { label: "Below your target rate — renegotiate", tone: "bad" as const };
    return { label: "At your target rate", tone: "neutral" as const };
  }, [effectiveRate, gap]);

  const verdictClass =
    verdict.tone === "good"
      ? "text-emerald-700"
      : verdict.tone === "bad"
        ? "text-red-700"
        : "text-ink-700";

  return (
    <div>
      <div class="grid sm:grid-cols-3 gap-5">
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Monthly retainer fee</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <span class="text-ink-500">$</span>
            <input
              type="number"
              min={0}
              step={100}
              value={fee}
              onInput={(e) => setFee(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
            <span class="text-ink-500 text-sm whitespace-nowrap">/ mo</span>
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink-700">Hours it actually consumes / month</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <input
              type="number"
              min={0}
              step={1}
              value={hours}
              onInput={(e) => setHours(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
            <span class="text-ink-500 text-sm whitespace-nowrap">hrs</span>
          </div>
          <span class="mt-1 block text-xs text-ink-500">Be honest — include calls, revisions, and Slack time, not just deliverables.</span>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink-700">Your target hourly-equivalent rate</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <span class="text-ink-500">$</span>
            <input
              type="number"
              min={0}
              step={5}
              value={targetRate}
              onInput={(e) => setTargetRate(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
          </div>
          <span class="mt-1 block text-xs text-ink-500">Don't know it? Use the Day Rate Calculator first.</span>
        </label>
      </div>

      <div class="mt-6 grid sm:grid-cols-3 gap-4">
        <div class="rounded-lg bg-ink-950 text-white p-5">
          <p class="text-xs uppercase tracking-wide text-brass-400">Effective hourly rate</p>
          <p class="text-2xl font-serif mt-1">{effectiveRate === null ? "—" : formatUSD(effectiveRate)}</p>
        </div>
        <div class="rounded-lg bg-ink-100 p-5">
          <p class="text-xs uppercase tracking-wide text-ink-500">Gap vs target rate</p>
          <p class="text-2xl font-serif mt-1 text-ink-950">
            {gap === null
              ? "—"
              : `${gap >= 0 ? "+" : "−"}${formatUSD(Math.abs(gap))}${gapPct === null ? "" : ` (${gapPct >= 0 ? "+" : "−"}${Math.abs(gapPct).toFixed(0)}%)`}`}
          </p>
        </div>
        <div class="rounded-lg bg-ink-100 p-5">
          <p class="text-xs uppercase tracking-wide text-ink-500">Verdict</p>
          <p class={`text-lg font-serif mt-1 ${verdictClass}`}>{verdict.label}</p>
        </div>
      </div>
      <p class="mt-4 text-xs text-ink-500">
        A retainer is only worth it if the guaranteed income beats what those hours would earn elsewhere. If you're below target, cap the included hours or raise the fee — see the Retainer Agreement and Rate Card templates.
      </p>
    </div>
  );
}
