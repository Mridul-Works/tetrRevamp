"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useDragScroll } from "@/lib/hooks";
import { v2Belt, type BeltItem } from "@/data/v2";

/**
 * The "belt": a row of stub cards that creeps left on its own and can be dragged.
 * Content is tripled so the loop can wrap without a visible seam.
 * `tone="forest"` paints it in Tetr's dark green for the country wave.
 */
export default function Belt({
  items = v2Belt,
  caption = "First wave — drag the belt",
  hint = "Auto-slides — drag to browse",
  tone = "paper",
}: {
  items?: BeltItem[];
  caption?: string;
  hint?: string;
  tone?: "paper" | "forest";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDragScroll(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let paused = false;
    const third = () => el.scrollWidth / 3;
    el.scrollLeft = third();
    const step = () => {
      if (!paused) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= third() * 2) el.scrollLeft -= third();
        else if (el.scrollLeft <= 0) el.scrollLeft += third();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const on = () => (paused = true);
    const off = () => (paused = false);
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    el.addEventListener("touchstart", on, { passive: true });
    el.addEventListener("touchend", off);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", on);
      el.removeEventListener("pointerleave", off);
      el.removeEventListener("touchstart", on);
      el.removeEventListener("touchend", off);
    };
  }, []);

  const all = [...items, ...items, ...items];
  const dark = tone === "forest";
  const rule = dark ? "border-snow/15" : "v2-rule";

  return (
    <section className={cn("border-y", rule, dark && "grain relative bg-forest text-cream")}>
      <div className="container-x flex items-center justify-between py-3">
        <p className={cn("v2-mono", dark && "text-mint")}>{caption}</p>
        <p className={cn("v2-mono hidden sm:block", dark ? "text-cream/50" : "v2-mute")}>{hint}</p>
      </div>
      <div ref={ref} className={cn("v2-belt no-scrollbar flex overflow-x-auto border-t select-none", rule)}>
        {all.map((it, i) => (
          <article key={i} className={cn("flex w-[320px] shrink-0 border-r sm:w-[380px]", rule)} aria-hidden={i >= items.length}>
            {it.image && <img src={it.image} alt="" loading="lazy" draggable={false} className="w-[110px] shrink-0 object-cover" />}
            <div className="flex flex-1 flex-col justify-between gap-8 p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="v2-display text-[28px] leading-none">{it.k}</span>
                <span className={cn("v2-mono", dark ? "text-cream/50" : "v2-mute")}>{String((i % items.length) + 1).padStart(2, "0")}</span>
              </div>
              <p className={cn("v2-mono", dark && "text-gold")}>{it.v}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
