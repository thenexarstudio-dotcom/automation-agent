import { useState } from "preact/hooks";

function formatUSD(n: number) {
  if (!isFinite(n) || n < 0) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function ScopeCreepCalculator() {
  const [hourlyRate, setHourlyRate] = useState(85);
  const [extraHoursPerWeek, setExtraHoursPerWeek] = useState(3);
  const [projectWeeks, setProjectWeeks] = useState(8);

  const weeklyLoss = hourlyRate * extraHoursPerWeek;
  const projectLoss = weeklyLoss * projectWeeks;
  const annualizedLoss = weeklyLoss * 46; // ~46 working weeks/year

  return (
    <div>
      <div class="grid sm:grid-cols-3 gap-5">
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Your hourly-equivalent rate</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <span class="text-ink-300">$</span>
            <input
              type="number"
              min={0}
              step={5}
              value={hourlyRate}
              onInput={(e) => setHourlyRate(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
          </div>
          <span class="mt-1 block text-xs text-ink-300">Don't know it? Use the Day Rate Calculator first.</span>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink-700">Unbilled extra hours / week</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <input
              type="number"
              min={0}
              step={0.5}
              value={extraHoursPerWeek}
              onInput={(e) => setExtraHoursPerWeek(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
            <span class="text-ink-300 text-sm whitespace-nowrap">hrs</span>
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink-700">Project length</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <input
              type="number"
              min={1}
              value={projectWeeks}
              onInput={(e) => setProjectWeeks(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
            <span class="text-ink-300 text-sm whitespace-nowrap">weeks</span>
          </div>
        </label>
      </div>

      <div class="mt-6 grid sm:grid-cols-3 gap-4">
        <div class="rounded-lg bg-ink-100 p-5">
          <p class="text-xs uppercase tracking-wide text-ink-500">Cost per week</p>
          <p class="text-2xl font-serif mt-1 text-ink-950">{formatUSD(weeklyLoss)}</p>
        </div>
        <div class="rounded-lg bg-ink-950 text-white p-5">
          <p class="text-xs uppercase tracking-wide text-brass-400">Cost over this project</p>
          <p class="text-2xl font-serif mt-1">{formatUSD(projectLoss)}</p>
        </div>
        <div class="rounded-lg bg-ink-100 p-5">
          <p class="text-xs uppercase tracking-wide text-ink-500">If this repeats all year</p>
          <p class="text-2xl font-serif mt-1 text-ink-950">{formatUSD(annualizedLoss)}</p>
        </div>
      </div>
      <p class="mt-4 text-xs text-ink-300">
        The fix isn't refusing requests — it's pricing them. See the Scope of Work and Change Order templates for how to approve additions without absorbing them for free.
      </p>
    </div>
  );
}
