"use client";

import { useState } from "react";
import { PrimaryToyButton, Stat, Verdict } from "./parts";

type Bit = { dx: number; dy: number; r: number; hue: string };
const HUES = ["var(--c)", "var(--color-gold)", "var(--color-snow)", "var(--color-mint)"];
const START = [100, 99.2, 100.6, 100.1, 101.4, 100.8, 101.9, 101.2, 102.3, 101.7, 102.6, 102.1];

/** USA: ring the Nasdaq opening bell and watch TETR tick up. */
export default function RingBell() {
  const [series, setSeries] = useState<number[]>(START);
  const [rings, setRings] = useState(0);
  const [bits, setBits] = useState<Bit[]>([]);
  const price = series[series.length - 1];
  const open = series[0];
  const change = ((price - open) / open) * 100;

  const ring = () => {
    const pop = 1 + (1 + Math.random() * 5) / 100;
    setSeries((s) => [...s.slice(-23), Math.round(s[s.length - 1] * pop * 100) / 100]);
    setRings((n) => n + 1);
    setBits(
      Array.from({ length: 16 }, (_, i) => ({
        dx: (Math.random() - 0.5) * 260,
        dy: -40 - Math.random() * 120,
        r: (Math.random() - 0.5) * 720,
        hue: HUES[i % HUES.length],
      })),
    );
  };

  const min = Math.min(...series);
  const max = Math.max(...series);
  const pts = series.map((v, i) => `${(i / (series.length - 1)) * 240},${54 - ((v - min) / (max - min || 1)) * 48}`).join(" ");

  return (
    <div className="grid gap-6 sm:grid-cols-[130px_1fr]">
      <div className="relative grid place-items-center">
        {/* re-keyed so the swing restarts on every ring */}
        <svg key={rings} viewBox="0 0 80 90" className={rings ? "v2-ring h-[120px]" : "h-[120px]"} aria-hidden>
          <path d="M40 4 V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 62 C 18 30, 26 14, 40 14 C 54 14, 62 30, 62 62 L68 70 H12 Z" fill="var(--c)" />
          <path d="M26 56 C 26 36, 31 24, 38 21" stroke="rgb(255 255 255 / .5)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="78" r="6" fill="var(--color-gold)" />
        </svg>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {bits.map((b, i) => (
            <span key={`${rings}-${i}`} className="v2-confetti" style={{ background: b.hue, "--dx": `${b.dx}px`, "--dy": `${b.dy}px`, "--r": `${b.r}deg` } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-6">
          <div className="flex gap-8">
            <Stat label="TETR" value={`$${price.toFixed(2)}`} tone="accent" />
            <Stat label="Today" value={`+${change.toFixed(1)}%`} />
          </div>
          <span className="v2-mono text-cream/50">{rings} {rings === 1 ? "ring" : "rings"}</span>
        </div>
        <svg viewBox="0 0 240 58" className="h-16 w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
          <path d="M0 54 H240" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="2 4" />
          <polyline points={pts} fill="none" stroke="var(--c)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <Verdict>
          {rings === 0
            ? "9:30 in Times Square. The floor is waiting for you."
            : rings < 4
              ? "The market likes it. Ring it again."
              : "That is a good open. In Term 5 the people across the table are real investors."}
        </Verdict>
        <PrimaryToyButton onClick={ring} className="self-start">
          Ring the bell
        </PrimaryToyButton>
      </div>
    </div>
  );
}
