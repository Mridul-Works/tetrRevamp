"use client";

import { useEffect, useRef, useState } from "react";
import { Stat, Verdict } from "./parts";

type Phase = "idle" | "arming" | "hold" | "go" | "done" | "jump";

/** Europe: the Formula 1 start. Five reds come on, go out, and you react. */
export default function LightsOut() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState(0);
  const [ms, setMs] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t0 = useRef(0);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const start = () => {
    clear();
    setMs(null);
    setLit(0);
    setPhase("arming");
    for (let i = 1; i <= 5; i++) timers.current.push(setTimeout(() => setLit(i), i * 550));
    const hold = 5 * 550 + 700 + Math.random() * 1900;
    timers.current.push(setTimeout(() => setPhase("hold"), 5 * 550));
    timers.current.push(
      setTimeout(() => {
        setLit(0);
        t0.current = performance.now();
        setPhase("go");
      }, hold),
    );
  };

  const hit = () => {
    if (phase === "idle" || phase === "done" || phase === "jump") return start();
    if (phase === "go") {
      const t = Math.round(performance.now() - t0.current);
      setMs(t);
      setBest((b) => (b === null ? t : Math.min(b, t)));
      return setPhase("done");
    }
    clear();
    setLit(0);
    setPhase("jump");
  };

  const label =
    phase === "idle" ? "Start engines" : phase === "go" ? "GO!" : phase === "done" ? "Go again" : phase === "jump" ? "Jump start. Again" : "Wait for it…";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-6">
        <div className="flex gap-2 border border-snow/20 bg-ink p-3" aria-hidden>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className="size-8 rounded-full border border-snow/20 transition-[background-color,box-shadow] duration-100 sm:size-10"
              style={n <= lit ? { background: "#e0281d", boxShadow: "0 0 22px #e0281d" } : { background: "#1a1414" }}
            />
          ))}
        </div>
        <div className="flex gap-8">
          <Stat label="Reaction" value={ms === null ? "—" : `${ms} ms`} tone="accent" />
          <Stat label="Best" value={best === null ? "—" : `${best} ms`} />
        </div>
      </div>

      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          hit();
        }}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), hit())}
        className="v2-display h-24 touch-none text-[34px] text-ink transition-[background-color,transform] duration-100 select-none active:scale-[0.99]"
        style={{ background: phase === "go" ? "var(--color-mint)" : phase === "jump" ? "#ff7a6b" : phase === "arming" || phase === "hold" ? "rgb(255 255 255 / .22)" : "var(--c)" }}
      >
        {label}
      </button>

      <Verdict>
        {phase === "jump"
          ? "Ten-second penalty. Patience is also a business skill."
          : ms === null
            ? "Five lights on, then out. Hit the bar the moment they go dark."
            : ms < 230
              ? "Pole-position reflexes. A real F1 start is about 200 ms."
              : ms < 380
                ? "Solid midfield. The Italian Grand Prix sells that fraction of a second for millions."
                : "The grid has left without you. Try again."}
      </Verdict>
    </div>
  );
}
