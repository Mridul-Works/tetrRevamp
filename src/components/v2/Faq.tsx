"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { v2Faq } from "@/data/v2";

/** Numbered accordion with a "+" that turns into "×" when open. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="container-x scroll-mt-16 pt-24 md:pt-32">
      <h2 className="v2-display text-[clamp(44px,6.5vw,104px)]">{v2Faq.title}</h2>
      <ul className="mt-10 border-t v2-rule">
        {v2Faq.items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={it.q} className="border-b v2-rule">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="grid w-full grid-cols-[48px_1fr_32px] items-center gap-4 py-6 text-left md:grid-cols-[120px_1fr_32px]"
              >
                <span className="v2-mono v2-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(18px,2vw,26px)] font-medium leading-tight tracking-[-0.01em]">{it.q}</span>
                <span aria-hidden className={cn("justify-self-end font-sans text-[34px] font-light leading-none transition-transform duration-300", isOpen && "rotate-45")}>
                  +
                </span>
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-400 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className="max-w-[64ch] pb-7 pl-[64px] text-[15px] leading-[1.6] v2-mute md:pl-[136px]">{it.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
