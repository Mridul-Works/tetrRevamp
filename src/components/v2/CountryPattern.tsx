"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/*
 * A repeating motif per country, drawn in its own colour behind the stage:
 * jaali petals for India, an eight-point star for Dubai, a lattice window for China,
 * kente bands for Ghana, a ticker zigzag with stars for the USA, the Sol de Mayo
 * for Argentina and a chequered flag for Europe.
 */
const TILE: Record<string, { size: [number, number]; body: React.ReactNode }> = {
  India: {
    size: [56, 56],
    body: (
      <>
        <path d="M28 6 Q38 17 28 28 Q18 17 28 6 Z M28 50 Q38 39 28 28 Q18 39 28 50 Z M6 28 Q17 18 28 28 Q17 38 6 28 Z M50 28 Q39 18 28 28 Q39 38 50 28 Z" />
        <circle cx="28" cy="28" r="3" />
        <circle cx="0" cy="0" r="2" /><circle cx="56" cy="0" r="2" /><circle cx="0" cy="56" r="2" /><circle cx="56" cy="56" r="2" />
      </>
    ),
  },
  Dubai: {
    size: [56, 56],
    body: (
      <>
        <path d="M28 4 L52 28 L28 52 L4 28 Z M11 11 H45 V45 H11 Z" />
        <path d="M28 18 L38 28 L28 38 L18 28 Z" />
      </>
    ),
  },
  China: {
    size: [44, 44],
    body: <path d="M0 22 H44 M22 0 V44 M9 9 H35 V35 H9 Z M15 15 H29 V29 H15 Z" />,
  },
  Ghana: {
    size: [56, 28],
    body: (
      <>
        <path d="M4 0 V28 M9 0 V28 M32 0 V28 M37 0 V28" />
        <path d="M14 5 H27 M14 11 H27 M14 17 H27 M14 23 H27 M42 5 H56 M42 11 H56 M42 17 H56 M42 23 H56" />
      </>
    ),
  },
  USA: {
    size: [64, 48],
    body: (
      <>
        <path d="M0 36 L12 28 L22 32 L36 14 L48 22 L64 10" />
        <path d="M14 8 l1.5 4.2 4.4 .1 -3.5 2.7 1.3 4.2 -3.7 -2.5 -3.7 2.5 1.3 -4.2 -3.5 -2.7 4.4 -.1 Z" />
      </>
    ),
  },
  Argentina: {
    size: [64, 64],
    body: (
      <>
        <circle cx="32" cy="32" r="8" />
        <path d="M32 18 V8 M32 46 V56 M18 32 H8 M46 32 H56 M22 22 L15 15 M42 22 L49 15 M22 42 L15 49 M42 42 L49 49" />
      </>
    ),
  },
  Europe: {
    size: [36, 36],
    body: <path d="M0 0 H18 V18 H0 Z M18 18 H36 V36 H18 Z" fill="currentColor" fillOpacity="0.38" stroke="none" />,
  },
};

export default function CountryPattern({ country, className }: { country: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const tile = TILE[country];
  if (!tile) return null;
  const [w, h] = tile.size;
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} style={{ color: "var(--c)" }}>
      <defs>
        <pattern id={`pat-${id}`} width={w} height={h} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {tile.body}
          </g>
        </pattern>
        <radialGradient id={`fade-${id}`} cx="70%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`mask-${id}`}>
          <rect width="100%" height="100%" fill={`url(#fade-${id})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#pat-${id})`} mask={`url(#mask-${id})`} />
    </svg>
  );
}
