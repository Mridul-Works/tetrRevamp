"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Round rubber-stamp postmark: curved text around the rim, the place name across the middle,
 * cancel lines trailing off the right. Re-mount it (change its key) to slap it down again.
 */
export default function Postmark({
  place,
  rim = "TETR COLLEGE OF BUSINESS · ARRIVED · ",
  sub,
  color = "var(--color-mint)",
  tilt = -8,
  className,
}: {
  place: string;
  rim?: string;
  sub?: string;
  color?: string;
  tilt?: number;
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 200 140"
      aria-hidden
      className={cn("stamp-in", className)}
      style={{ "--tilt": `${tilt}deg`, color } as React.CSSProperties}
    >
      <defs>
        <path id={`${id}-rim`} d="M70 70 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        {/* rough ink edge */}
        <filter id={`${id}-ink`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
        </filter>
      </defs>
      <g filter={`url(#${id}-ink)`} fill="none" stroke="currentColor" opacity="0.92">
        <circle cx="70" cy="70" r="56" strokeWidth="2.2" />
        <circle cx="70" cy="70" r="38" strokeWidth="1.2" />
        {/* cancel lines */}
        <path d="M124 48 C 150 46, 170 48, 196 46 M126 60 C 150 58, 172 60, 198 58 M126 72 C 150 70, 172 72, 198 70 M124 84 C 150 82, 170 84, 196 82 M122 96 C 148 94, 168 96, 194 94" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g filter={`url(#${id}-ink)`} fill="currentColor" fontFamily="var(--font-mono)" fontWeight="600">
        <text fontSize="9.2" letterSpacing="1.6">
          <textPath href={`#${id}-rim`} startOffset="0">
            {rim}
          </textPath>
        </text>
        <text x="70" y="68" textAnchor="middle" fontSize={place.length > 8 ? 12 : 15} letterSpacing="1" fontFamily="var(--font-sans)" fontWeight="700">
          {place.toUpperCase()}
        </text>
        {sub && (
          <text x="70" y="82" textAnchor="middle" fontSize="7.5" letterSpacing="1.4">
            {sub.toUpperCase()}
          </text>
        )}
      </g>
    </svg>
  );
}
