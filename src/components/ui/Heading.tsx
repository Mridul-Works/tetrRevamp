"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Bold } from "./RichText";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Splits text into per-word masks so each word can rise into view. */
export function Words({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i, arr) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
          <span data-word className={cn("inline-block will-change-transform", className)}>
            {w}
            {i < arr.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
  );
}

/** Word-by-word rise for any element containing [data-word] spans, plus fade for [data-fade]. */
export function useWordReveal<T extends HTMLElement>(start = "top 82%") {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll("[data-word]");
      const fades = el.querySelectorAll("[data-fade]");
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start, once: true } });
      if (words.length) tl.from(words, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.035 });
      if (fades.length) tl.from(fades, { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08 }, "-=0.8");
    },
    { scope: ref },
  );
  return ref;
}

type HeadingProps = {
  line1: string;
  line2?: string;
  byline?: string;
  tone?: "dark" | "light";
  breakLine?: boolean;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
};

/** Section heading: sans first line, italic serif second line, optional byline + action slot. */
export default function Heading({ line1, line2, byline, tone = "dark", breakLine, eyebrow, className, children }: HeadingProps) {
  const ref = useWordReveal<HTMLDivElement>();
  const dark = tone === "dark";
  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-x-16 gap-y-6 lg:items-end",
        byline ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_auto]",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p data-fade className={cn("eyebrow mb-5 flex items-center gap-3", dark ? "text-mint" : "text-deep")}>
            <span className={cn("h-px w-8", dark ? "bg-mint" : "bg-deep")} />
            {eyebrow}
          </p>
        )}
        <h2 className={cn("section-title max-w-[860px]", dark ? "text-snow" : "text-ink")}>
          <Words text={line1} />
          {line2 && (breakLine ? <br /> : " ")}
          {line2 && <Words text={line2} className={cn("accent", dark ? "text-snow" : "text-ink")} />}
        </h2>
      </div>
      {byline && (
        <p
          data-fade
          className={cn("max-w-[540px] text-[15.5px] leading-[1.65]", dark ? "text-byline" : "text-byline-light")}
        >
          <Bold text={byline} strongClass={cn("font-semibold", dark ? "text-snow" : "text-ink")} />
        </p>
      )}
      {children && (
        <div data-fade className={cn("flex items-center gap-3", byline && "lg:col-span-2")}>
          {children}
        </div>
      )}
    </div>
  );
}
