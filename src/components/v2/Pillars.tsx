"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { finePointer } from "@/lib/pointer";
import { hero } from "@/data/content";
import { v2Pillars } from "@/data/v2";

const SHOTS = [hero.images[0], hero.images[5], hero.images[2]];

/**
 * Three numbered pillars on forest green. With a mouse, a photo trails the pointer and
 * swaps as you move from row to row; the hovered word turns mint and slides right.
 */
export default function Pillars() {
  const root = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [row, setRow] = useState<number | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !finePointer()) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      if (float.current) float.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-112%, -50%) rotate(${((tx - x) * 0.05).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    el.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <section ref={root} className="grain relative mt-24 overflow-hidden bg-forest text-cream md:mt-32" onPointerLeave={() => setRow(null)}>
      <div className="container-x relative z-10 py-16 md:py-24">
        <ol className="border-t border-snow/15">
          {v2Pillars.map((p, n) => (
            <li
              key={p.n}
              onPointerEnter={() => setRow(n)}
              className={cn("grid gap-4 border-b border-snow/15 py-8 transition-opacity duration-300 md:grid-cols-12 md:items-center", row !== null && row !== n && "opacity-35")}
            >
              <span className="v2-mono self-start text-mint md:col-span-2">{p.n}</span>
              <h3 className={cn("v2-display text-[clamp(48px,8vw,128px)] transition-[color,translate] duration-500 ease-[var(--ease-out-expo)] md:col-span-5", row === n ? "translate-x-4 text-mint" : "text-snow")}>{p.title}</h3>
              <p className="max-w-[44ch] text-[15px] leading-[1.55] text-cream/70 md:col-span-5">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* the trailing photo */}
      <div ref={float} aria-hidden className="pointer-events-none absolute top-0 left-0 z-20 hidden w-[240px] md:block">
        <div className={cn("relative aspect-[4/5] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,.5)] transition-[opacity,scale] duration-500 ease-[var(--ease-out-expo)]", row === null ? "scale-75 opacity-0" : "scale-100 opacity-100")}>
          {SHOTS.map((src, n) => (
            <img key={src} src={src} alt="" loading="lazy" className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500", row === n ? "opacity-100" : "opacity-0")} />
          ))}
        </div>
      </div>
    </section>
  );
}
