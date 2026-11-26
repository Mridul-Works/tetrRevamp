"use client";

import { useEffect, useRef, useState } from "react";
import { PrimaryToyButton, Stat, ToyButton, Verdict } from "./parts";

const TOP = 828; // metres
const FLOORS = 163;
const TOWER = "M44 196 L49 150 L52 148 L54 112 L57 110 L58.5 70 L60.5 68 L62 16 L63.5 68 L65.5 70 L67 110 L70 112 L72 148 L75 150 L80 196 Z";

/** Dubai: press and hold to raise the Burj Khalifa to its full 828 metres. */
export default function BuildBurj() {
  const [h, setH] = useState(0);
  const raf = useRef(0);
  const done = h >= TOP;

  const stop = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  };
  const start = () => {
    if (raf.current) return;
    // metres per second, not per frame, so a slow device builds at the same pace
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      setH((v) => Math.min(TOP, Math.round(v + dt * 0.3)));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => stop, []);
  useEffect(() => {
    if (done) stop();
  }, [done]);

  const y = 196 - (180 * h) / TOP;

  return (
    <div className="grid grid-cols-[96px_1fr] gap-4 sm:grid-cols-[150px_1fr] sm:gap-6">
      <svg viewBox="0 0 124 204" className="h-[210px] w-full" aria-hidden>
        <defs>
          <clipPath id="burj-fill">
            <rect x="0" y={y} width="124" height={204 - y} />
          </clipPath>
        </defs>
        <path d="M10 196 H114" stroke="currentColor" strokeOpacity="0.4" />
        <path d={TOWER} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 3" />
        <path d={TOWER} fill="var(--c)" clipPath="url(#burj-fill)" />
        {/* ruler */}
        {[200, 400, 600, 828].map((m) => {
          const ty = 196 - (180 * m) / TOP;
          return (
            <g key={m} opacity={h >= m ? 1 : 0.35}>
              <path d={`M92 ${ty} H104`} stroke="currentColor" />
              <text x="108" y={ty + 3} fontSize="7" fontFamily="var(--font-mono)" fill="currentColor">
                {m}
              </text>
            </g>
          );
        })}
        {done && <path d="M62 16 V4 H74 L70 8 L74 12 H62" fill="var(--color-gold)" stroke="var(--color-gold)" className="v2-pop" />}
      </svg>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex gap-8">
          <Stat label="Height" value={`${h} m`} tone="accent" />
          <Stat label="Floor" value={Math.round((h / TOP) * FLOORS)} />
        </div>
        <Verdict>
          {done
            ? "Tallest building on Earth. Now sell the view: that is the Dubai term."
            : h === 0
              ? "Emaar poured the foundations in 2004. Your turn."
              : h < 450
                ? "Past the Eiffel Tower. Keep holding."
                : "You are above the clouds on a good day. Nearly there."}
        </Verdict>
        <div className="flex flex-wrap gap-2">
          <PrimaryToyButton
            disabled={done}
            onPointerDown={start}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
            onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setH((v) => Math.min(TOP, v + 40))}
            className="touch-none whitespace-nowrap px-4 sm:px-6"
          >
            {done ? "Topped out" : "Hold to build"}
          </PrimaryToyButton>
          <ToyButton onClick={() => setH(0)} disabled={h === 0}>
            Reset
          </ToyButton>
        </div>
      </div>
    </div>
  );
}
