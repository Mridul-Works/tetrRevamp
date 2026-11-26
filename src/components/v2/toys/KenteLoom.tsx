"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ToyButton, Verdict } from "./parts";

const COLS = 14;
const ROWS = 6;
const THREADS = [
  { name: "Gold", hex: "#F2C94C", means: "wealth and royalty" },
  { name: "Green", hex: "#1E7A46", means: "growth and harvest" },
  { name: "Red", hex: "#C8372D", means: "sacrifice and courage" },
  { name: "Black", hex: "#0B0B0B", means: "maturity and spirit" },
];

const preset = () => Array.from({ length: COLS * ROWS }, (_, i) => (Math.floor((i % COLS) / 2) + Math.floor(i / COLS)) % THREADS.length);

/** Ghana: paint a strip of Kente. Click or drag across the loom with a thread colour. */
export default function KenteLoom() {
  const [cells, setCells] = useState<number[]>(preset);
  const [thread, setThread] = useState(0);

  const paint = (i: number) => setCells((c) => (c[i] === thread ? c : c.map((v, j) => (j === i ? thread : v))));

  const shuffle = () => {
    // mirrored two-wide blocks, the way real strips repeat
    const half = COLS / 2;
    const next = new Array<number>(COLS * ROWS);
    for (let r = 0; r < ROWS; r++) {
      for (let b = 0; b < Math.ceil(half / 2); b++) {
        const v = Math.floor(Math.random() * THREADS.length);
        for (const x of [b * 2, b * 2 + 1]) {
          if (x >= half) continue;
          next[r * COLS + x] = v;
          next[r * COLS + (COLS - 1 - x)] = v;
        }
      }
    }
    setCells(next);
  };

  const used = THREADS.map((_, t) => cells.filter((c) => c === t).length);
  const lead = used.indexOf(Math.max(...used));

  return (
    <div className="flex flex-col gap-4">
      <div
        className="grid touch-none gap-[3px] border border-snow/20 p-[3px] select-none"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        role="group"
        aria-label="Kente loom"
      >
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Row ${Math.floor(i / COLS) + 1}, column ${(i % COLS) + 1}: ${THREADS[c].name}`}
            onPointerDown={(e) => {
              (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
              paint(i);
            }}
            onPointerEnter={(e) => e.buttons === 1 && paint(i)}
            onKeyDown={(e) => (e.key === " " || e.key === "Enter") && paint(i)}
            className="aspect-square transition-colors duration-150"
            style={{
              backgroundColor: THREADS[c].hex,
              // weave texture: alternate the thread direction cell by cell
              backgroundImage: `repeating-linear-gradient(${(i + Math.floor(i / COLS)) % 2 ? 0 : 90}deg, rgb(255 255 255 / .16) 0 1px, transparent 1px 4px)`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5" role="radiogroup" aria-label="Thread colour">
          {THREADS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="radio"
              aria-checked={thread === i}
              aria-label={t.name}
              onClick={() => setThread(i)}
              className={cn("size-10 border-2 transition-transform", thread === i ? "scale-110 border-snow" : "border-snow/25")}
              style={{ background: t.hex }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <ToyButton onClick={shuffle}>Shuffle</ToyButton>
          <ToyButton onClick={() => setCells(preset())}>Reset</ToyButton>
        </div>
      </div>

      <Verdict>
        Mostly <span style={{ color: THREADS[lead].hex === "#0B0B0B" ? "var(--color-cream)" : THREADS[lead].hex }}>{THREADS[lead].name.toLowerCase()}</span>: in Kente that
        stands for {THREADS[lead].means}. In Accra you will sell what the pattern means, not just the cloth.
      </Verdict>
    </div>
  );
}
