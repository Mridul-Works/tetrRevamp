"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Counts up the numeric part of a display value ("$172K+", "21.86%", "USD 504,000+")
 * while keeping its prefix, suffix, decimals and thousands separators.
 */
export default function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const m = value.match(/^(\D*?)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!el || !m) return;
      const [, prefix, num, suffix] = m;
      const target = parseFloat(num.replace(/,/g, ""));
      const decimals = num.includes(".") ? num.split(".")[1].length : 0;
      const commas = num.includes(",");
      const fmt = (n: number) => {
        const s = n.toFixed(decimals);
        return commas ? Number(s).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : s;
      };
      const state = { n: 0 };
      el.textContent = prefix + fmt(0) + suffix;
      gsap.to(state, {
        n: target,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = prefix + fmt(state.n) + suffix;
        },
        onComplete: () => {
          el.textContent = value;
        },
      });
    },
    { dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
