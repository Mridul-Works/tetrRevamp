"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { strokesFor } from "./doodles";

/**
 * A country's landmark doodle that inks itself in, stroke by stroke. Re-mount it
 * (change its key) to draw again. Accent strokes take the country's colour from --c.
 */
export default function CountrySketch({ country, className }: { country: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const strokes = strokesFor(country);
  return (
    <svg
      viewBox="0 0 300 170"
      fill="none"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("h-auto w-full overflow-visible", className)}
    >
      <defs>
        {/* a slight wobble so the lines read as pen, not vector */}
        <filter id={`wob-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
        </filter>
      </defs>
      <g filter={`url(#wob-${id})`}>
        {strokes.map(([d, tone = "ink"], i) => {
          const stroke = tone === "a" ? "var(--c, var(--color-mint))" : tone === "b" ? "var(--color-gold)" : "currentColor";
          if (tone === "dash") {
            return <path key={i} d={d} stroke="currentColor" strokeOpacity={0.5} strokeDasharray="1.5 4" style={{ animation: `fade-in .6s ${0.5 + i * 0.05}s both` }} />;
          }
          return (
            <path
              key={i}
              d={d}
              pathLength={1}
              stroke={stroke}
              strokeOpacity={tone === "soft" ? 0.5 : 1}
              className="v2-draw"
              style={{ animationDelay: `${i * 70}ms` }}
            />
          );
        })}
      </g>
    </svg>
  );
}
