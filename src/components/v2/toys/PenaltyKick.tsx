"use client";

import { useEffect, useRef, useState } from "react";
import { Stat, Verdict } from "./parts";

const X = [72, 150, 228]; // centre of each third of the goal
const SIDES = ["left", "centre", "right"] as const;
type Shot = { third: number; keeper: number; y: number } | null;

/** Argentina: take a penalty at La Bombonera. Pick a side; the keeper guesses too. */
export default function PenaltyKick() {
  const [shot, setShot] = useState<Shot>(null);
  const [landed, setLanded] = useState(false);
  const [score, setScore] = useState({ goals: 0, shots: 0 });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const busy = shot !== null;
  const saved = shot !== null && shot.third === shot.keeper;

  const shoot = (third: number) => {
    if (busy) return;
    const next = { third, keeper: Math.floor(Math.random() * 3), y: 58 + Math.random() * 36 };
    setShot(next);
    setLanded(false);
    timers.current.push(
      setTimeout(() => {
        setLanded(true);
        setScore((s) => ({ shots: s.shots + 1, goals: s.goals + (next.third === next.keeper ? 0 : 1) }));
      }, 520),
      setTimeout(() => setShot(null), 1700),
    );
  };

  const ball = shot ? { x: X[shot.third], y: shot.y, s: 0.62 } : { x: 150, y: 150, s: 1 };
  const keeperX = shot ? X[shot.keeper] : 150;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg viewBox="0 0 300 172" className="w-full" aria-hidden>
          {/* net */}
          <path d="M34 34 H266 V128 H34 Z" fill="rgb(255 255 255 / .04)" />
          <path
            d="M57 34 V128 M80 34 V128 M103 34 V128 M126 34 V128 M150 34 V128 M174 34 V128 M197 34 V128 M220 34 V128 M243 34 V128 M34 58 H266 M34 82 H266 M34 106 H266"
            stroke="currentColor"
            strokeOpacity="0.18"
          />
          <path d="M34 128 V34 H266 V128" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 128 H292" stroke="currentColor" strokeOpacity="0.4" />
          {/* keeper */}
          <g style={{ transform: `translateX(${keeperX - 150}px) rotate(${shot ? (shot.keeper - 1) * 28 : 0}deg)`, transformOrigin: "150px 128px", transition: "transform .45s cubic-bezier(.2,.8,.2,1)" }}>
            <circle cx="150" cy="78" r="8" fill="var(--c)" />
            <path d="M150 86 V112 M150 92 L132 80 M150 92 L168 80 M150 112 L140 128 M150 112 L160 128" stroke="var(--c)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
          {/* ball */}
          <g style={{ transform: `translate(${ball.x - 150}px, ${ball.y - 150}px) scale(${ball.s})`, transformOrigin: "150px 150px", transition: shot ? "transform .5s cubic-bezier(.3,.7,.3,1)" : "none" }}>
            <circle cx="150" cy="150" r="10" fill="var(--color-snow)" />
            <path d="M150 145 L155 149 L153 155 H147 L145 149 Z" fill="var(--color-ink)" />
          </g>
          <circle cx="150" cy="150" r="2" fill="currentColor" opacity="0.4" />
        </svg>
        {/* three thirds of the goal are the buttons */}
        <div className="absolute inset-x-[11%] top-[20%] grid h-[55%] grid-cols-3">
          {SIDES.map((side, i) => (
            <button
              key={side}
              type="button"
              disabled={busy}
              onClick={() => shoot(i)}
              aria-label={`Shoot ${side}`}
              className="group/zone grid place-items-end pb-1 transition-colors hover:bg-[color-mix(in_oklab,var(--c)_18%,transparent)] disabled:cursor-default"
            >
              <span className="v2-mono w-full text-center text-cream/0 transition-colors group-hover/zone:text-cream/80">{side}</span>
            </button>
          ))}
        </div>
        {landed && shot && (
          <p key={score.shots} className="v2-display v2-pop pointer-events-none absolute inset-x-0 top-[34%] text-center text-[44px]" style={{ color: saved ? "#ff7a6b" : "var(--color-gold)" }}>
            {saved ? "¡Atajada!" : "¡Gooool!"}
          </p>
        )}
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="flex gap-8">
          <Stat label="Goals" value={score.goals} tone="accent" />
          <Stat label="Shots" value={score.shots} />
        </div>
        <span className="v2-mono text-right text-cream/50">Pick a side</span>
      </div>
      <Verdict>
        {score.shots === 0
          ? "Fifty-four thousand people and one keeper. Pick your corner."
          : score.goals / score.shots >= 0.6
            ? "Clinical. Boca turns that noise into one of the strongest brands in football. You will study how."
            : "The keeper has your number. In Term 6 you learn to read a market better than he reads you."}
      </Verdict>
    </div>
  );
}
