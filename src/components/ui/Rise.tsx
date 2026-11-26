"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Section hand-off for a dark ↔ light change: the incoming section rises as a rounded
 * panel, inset from the sides, and widens to full bleed as it scrolls into place.
 * `from` is the background class of the section above, shown around the rising panel.
 */
export default function Rise({ from, children }: { from: string; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = panel.current!;
        const draw = (progress: number) => {
          const e = 1 - progress;
          if (e < 0.002) {
            el.style.clipPath = "none"; // fully open: nothing inside (pins, sticky bars) is clipped
            return;
          }
          const x = (e * window.innerWidth * 0.06).toFixed(1);
          const r = (e * 6).toFixed(1);
          el.style.clipPath = `inset(0 ${x}px 0 ${x}px round ${r}px ${r}px 0 0)`;
        };
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "top 18%",
          scrub: true,
          onUpdate: (self) => draw(self.progress),
          onRefresh: (self) => draw(self.progress),
        });
        return () => {
          st.kill();
          el.style.clipPath = "";
        };
      });
      return () => mm.revert();
    },
    { scope: panel },
  );

  return (
    <div className={cn(from)}>
      <div ref={panel}>{children}</div>
    </div>
  );
}
