"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Parts = { d: number; h: number; m: number; s: number } | null;

function split(to: Date): Parts {
  const ms = to.getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/**
 * Live countdown to a deadline, rendered as flip-style digit tiles. Starts empty on the
 * server and fills on the client so the first paint never shows a stale second.
 */
export default function Countdown({ to, label, className }: { to: string; label: string; className?: string }) {
  const [parts, setParts] = useState<Parts | undefined>(undefined);

  useEffect(() => {
    const target = new Date(to);
    const tick = () => setParts(split(target));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [to]);

  // deadline passed: step aside rather than contradict the copy around it
  if (parts === null) return null;

  const cells: [string, number | undefined][] = [
    ["days", parts?.d],
    ["hrs", parts?.h],
    ["min", parts?.m],
    ["sec", parts?.s],
  ];

  return (
    <div className={cn("inline-flex flex-col gap-3", className)} role="timer" aria-live="off" aria-label={label}>
      <p className="eyebrow flex items-center gap-2 text-gold">
        <span className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-gold [animation:ping-slow_1.8s_ease-out_infinite]" />
          <span className="relative size-2 rounded-full bg-gold" />
        </span>
        {label}
      </p>
      <div className="flex items-start gap-2">
        {cells.map(([unit, n], i) => (
          <div key={unit} className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <span className="relative grid h-14 w-[58px] place-items-center overflow-hidden rounded-sm border border-snow/15 bg-ink/60 font-mono text-[26px] font-medium tabular-nums text-snow backdrop-blur-sm">
                {/* split line of a flip clock */}
                <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-snow/10" />
                <span key={n} className="[animation:rise-in_.45s_var(--ease-out-expo)_both]">
                  {n === undefined ? "--" : String(n).padStart(2, "0")}
                </span>
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-snow/50">{unit}</span>
            </div>
            {i < cells.length - 1 && <span className="pt-4 font-mono text-[20px] leading-none text-snow/30">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
