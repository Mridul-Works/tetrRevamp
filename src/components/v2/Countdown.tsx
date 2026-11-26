"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Parts = { d: number; h: number; m: number; s: number };

function split(to: Date): Parts {
  const ms = Math.max(0, to.getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function useCountdown(to: string) {
  const [p, setP] = useState<Parts | null>(null);
  useEffect(() => {
    const t = new Date(to);
    const tick = () => setP(split(t));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);
  return p;
}

const pad = (n?: number) => (n === undefined ? "--" : String(n).padStart(2, "0"));

/** One-line mono readout, as in the reference hero: "Start: 110d 23h 24m 39s". */
export function InlineCountdown({ to, label, className }: { to: string; label: string; className?: string }) {
  const p = useCountdown(to);
  return (
    <p className={cn("v2-mono flex items-center gap-3 tabular-nums", className)} role="timer" aria-live="off">
      <span className="v2-mute">{label}</span>
      <span>
        {p ? `${p.d}d ${pad(p.h)}h ${pad(p.m)}m ${pad(p.s)}s` : "--d --h --m --s"}
      </span>
    </p>
  );
}

/** Four giant display numerals with unit captions, the closing beat of the page. */
export function BigCountdown({ to, className, dark }: { to: string; className?: string; dark?: boolean }) {
  const p = useCountdown(to);
  const cells: [string, number | undefined][] = [
    ["Days", p?.d],
    ["Hours", p?.h],
    ["Minutes", p?.m],
    ["Seconds", p?.s],
  ];
  const rule = dark ? "border-snow/15" : "v2-rule";
  return (
    <div className={cn("grid grid-cols-2 border-t md:grid-cols-4", rule, className)} role="timer" aria-live="off">
      {cells.map(([unit, n], i) => (
        <div key={unit} className={cn("flex flex-col gap-4 border-b py-8 md:border-b-0", rule, i % 2 === 1 && "border-l", i >= 2 && "md:border-l")}>
          <span className={cn("v2-mono px-6", dark ? "text-cream/50" : "v2-mute")}>{unit}</span>
          <span className={cn("v2-display px-6 text-[clamp(72px,12vw,180px)] tabular-nums", dark && "text-gold")}>{pad(n)}</span>
        </div>
      ))}
    </div>
  );
}
