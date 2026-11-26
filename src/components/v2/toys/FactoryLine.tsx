"use client";

import { useEffect, useRef, useState } from "react";
import { Stat, Verdict } from "./parts";

/** China: push the line speed and find where output stops being worth the defects. */
export default function FactoryLine() {
  const [speed, setSpeed] = useState(3);
  const [units, setUnits] = useState(0);
  const acc = useRef(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const t = setInterval(() => {
      acc.current += speedRef.current * 0.25;
      setUnits(Math.floor(acc.current));
    }, 100);
    return () => clearInterval(t);
  }, []);

  const defects = speed <= 6 ? 0.4 : Math.round((speed - 6) * 6.5 * 10) / 10;
  const hot = speed > 6;
  const boxes = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex gap-8">
          <Stat label="Units shipped" value={units.toLocaleString("en-US")} tone="accent" />
          <Stat label="Per minute" value={speed * 150} />
          <Stat label="Defects" value={`${defects}%`} tone={hot ? "warn" : undefined} />
        </div>
      </div>

      {/* the belt: speed sets how fast the row loops */}
      <div className="relative h-16 overflow-hidden border-y border-snow/20" aria-hidden>
        <div className="absolute inset-x-0 bottom-0 h-px bg-snow/30" />
        <div className="flex w-max animate-marquee items-end gap-6 pb-1.5 [animation-direction:reverse]" style={{ "--marquee-duration": `${16 / speed}s` } as React.CSSProperties}>
          {[...boxes, ...boxes].map((b, i) => {
            const bad = hot && b % Math.max(2, 11 - speed) === 0;
            return (
              <span
                key={i}
                className="grid size-11 place-items-center border text-[10px]"
                style={{ borderColor: bad ? "#ff7a6b" : "var(--c)", color: bad ? "#ff7a6b" : "var(--c)", rotate: bad ? "8deg" : undefined }}
              >
                <span className="v2-mono text-[9px]">{bad ? "✕" : "QC"}</span>
              </span>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-4">
        <span className="v2-mono shrink-0 text-cream/60">Line speed {speed}×</span>
        <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="v2-range" aria-label="Line speed" />
      </label>

      <Verdict>
        {speed <= 2
          ? "A calm line. Your competitor in Shenzhen shipped your whole order while you read this."
          : !hot
            ? "Fast and clean. This is the pace the Tesla Gigafactory tour makes you jealous of."
            : speed < 9
              ? "Output is up and so are returns. Somewhere a quality engineer is waving at you."
              : "Maximum speed. One box in three is going back. Speed is not the same as scale."}
      </Verdict>
    </div>
  );
}
