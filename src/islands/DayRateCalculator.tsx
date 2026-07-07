import { useMemo, useState } from "preact/hooks";

function formatUSD(n: number) {
  if (!isFinite(n) || n < 0) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function DayRateCalculator() {
  const [income, setIncome] = useState(90000);
  const [billableDays, setBillableDays] = useState(120);
  const [overhead, setOverhead] = useState(6000);
  const [projectDays, setProjectDays] = useState(10);

  const dayRate = useMemo(() => {
    if (billableDays <= 0) return 0;
    return (income + overhead) / billableDays;
  }, [income, overhead, billableDays]);

  const hourlyEquivalent = dayRate / 8;
  const projectPrice = dayRate * projectDays;

  return (
    <div>
      <div class="grid sm:grid-cols-2 gap-5">
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Annual income target</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <span class="text-ink-500">$</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={income}
              onInput={(e) => setIncome(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink-700">Billable days per year</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <input
              type="number"
              min={1}
              max={260}
              value={billableDays}
              onInput={(e) => setBillableDays(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
            <span class="text-ink-500 text-sm whitespace-nowrap">days / yr</span>
          </div>
          <span class="mt-1 block text-xs text-ink-500">After subtracting sales, admin, and time off — usually 100–140, not 220.</span>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink-700">Annual overhead</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <span class="text-ink-500">$</span>
            <input
              type="number"
              min={0}
              step={500}
              value={overhead}
              onInput={(e) => setOverhead(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
          </div>
          <span class="mt-1 block text-xs text-ink-500">Software, insurance, taxes, equipment.</span>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink-700">Typical project length</span>
          <div class="mt-1 flex items-center rounded-lg border border-ink-100 bg-ink-50 px-3">
            <input
              type="number"
              min={1}
              value={projectDays}
              onInput={(e) => setProjectDays(Number((e.target as HTMLInputElement).value))}
              class="w-full bg-transparent py-2.5 px-2 outline-none text-ink-950"
            />
            <span class="text-ink-500 text-sm whitespace-nowrap">days</span>
          </div>
        </label>
      </div>

      <div class="mt-6 grid sm:grid-cols-3 gap-4">
        <div class="rounded-lg bg-ink-950 text-white p-5">
          <p class="text-xs uppercase tracking-wide text-brass-400">Day rate</p>
          <p class="text-2xl font-serif mt-1">{formatUSD(dayRate)}</p>
        </div>
        <div class="rounded-lg bg-ink-100 p-5">
          <p class="text-xs uppercase tracking-wide text-ink-500">Hourly equivalent</p>
          <p class="text-2xl font-serif mt-1 text-ink-950">{formatUSD(hourlyEquivalent)}</p>
        </div>
        <div class="rounded-lg bg-ink-100 p-5">
          <p class="text-xs uppercase tracking-wide text-ink-500">Suggested project price</p>
          <p class="text-2xl font-serif mt-1 text-ink-950">{formatUSD(projectPrice)}</p>
        </div>
      </div>
      <p class="mt-4 text-xs text-ink-500">
        Quote the project price as a single investment, not an hourly rate — see the Consulting Proposal Template for how to present it.
      </p>
    </div>
  );
}
