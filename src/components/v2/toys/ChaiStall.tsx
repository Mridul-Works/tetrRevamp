"use client";

import { useState } from "react";
import { Stat, Verdict } from "./parts";

const COST = 6; // rupees to make a cup
const demand = (price: number) => Math.round(1400 * Math.exp(-price / 14));
const BEST = COST + 14; // where profit peaks on this curve
const PEAK = (BEST - COST) * demand(BEST);

/** India: price a cup of chai and watch the queue and the profit move against each other. */
export default function ChaiStall() {
  const [price, setPrice] = useState(8);
  const cups = demand(price);
  const profit = Math.max(0, price - COST) * cups;
  const glasses = Math.max(1, Math.min(28, Math.round(cups / 32)));
  const off = Math.abs(price - BEST);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <label htmlFor="chai-price" className="v2-display text-[44px] leading-none tabular-nums" style={{ color: "var(--c)" }}>
          ₹{price}
          <span className="v2-mono ml-2 align-middle whitespace-nowrap text-cream/50">a cup</span>
        </label>
        <div className="flex gap-8">
          <Stat label="Cups a day" value={cups.toLocaleString("en-IN")} />
          <Stat label="Profit a day" value={`₹${profit.toLocaleString("en-IN")}`} tone="accent" />
        </div>
      </div>

      <input id="chai-price" type="range" min={5} max={60} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="v2-range" />

      {/* the queue: one glass for every ~32 cups sold */}
      <div className="flex h-9 flex-wrap items-end gap-1.5" aria-hidden>
        {Array.from({ length: glasses }, (_, i) => (
          <span key={i} className="h-7 w-[11px] rounded-b-[3px] border border-cream/60" style={{ background: "linear-gradient(to top, var(--c) 62%, transparent 62%)" }} />
        ))}
      </div>

      {/* profit against the best this stall can do */}
      <div className="h-1.5 w-full bg-snow/10">
        <div className="h-full transition-[width] duration-300" style={{ width: `${Math.min(100, (profit / PEAK) * 100)}%`, background: "var(--c)" }} />
      </div>

      <Verdict>
        {off <= 3
          ? "Sweet spot. You just found the price Term 1 is about."
          : price < BEST
            ? "The queue goes round the block, and you are barely covering the milk."
            : price < 40
              ? "Fewer cups, fatter margin. The stall next door is watching your customers."
              : "Artisanal chai. Three tourists and a food blogger. Try again."}
      </Verdict>
    </div>
  );
}
