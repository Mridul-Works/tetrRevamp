"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/cn";

const STOPS: { id: string; label: string }[] = [
  { id: "top", label: "Start" },
  { id: "passes", label: "Ten things" },
  { id: "route", label: "The route" },
  { id: "programs", label: "Programs" },
  { id: "outcomes", label: "Outcomes" },
  { id: "career-labs", label: "Career Labs" },
  { id: "faculty", label: "Faculty" },
  { id: "immersions", label: "Immersions" },
  { id: "cohort", label: "Cohort" },
  { id: "campus", label: "Campus" },
  { id: "events", label: "Events" },
  { id: "scholarships", label: "Apply" },
];

/**
 * Route map down the right edge: one stop per section, the current one lit, labels on hover.
 * Hidden on small screens and while the hero is on screen, so it appears once the journey starts.
 */
export default function ScrollNav() {
  const [active, setActive] = useState("top");
  const [shown, setShown] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((e) => io.observe(e));
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -8 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const idx = Math.max(0, STOPS.findIndex((s) => s.id === active));

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-[opacity,translate] duration-700 ease-out-expo xl:block",
        shown ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0",
      )}
    >
      <ol className="group/nav relative flex flex-col items-end gap-[14px] py-2">
        {/* rail + filled progress */}
        <span aria-hidden className="absolute right-[5px] top-2 bottom-2 w-px bg-snow/15" />
        <span
          aria-hidden
          className="absolute right-[5px] top-2 w-px bg-mint transition-[height] duration-700 ease-out-expo"
          style={{ height: `calc(${(idx / (STOPS.length - 1)) * 100}% - ${(idx / (STOPS.length - 1)) * 16}px)` }}
        />
        {STOPS.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={on || undefined}
                className="group/stop flex items-center gap-3 text-right"
              >
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.16em] transition-[opacity,translate] duration-400 ease-out-expo",
                    on ? "text-mint" : "text-snow/70",
                    "translate-x-2 opacity-0 group-hover/nav:translate-x-0 group-hover/nav:opacity-100",
                  )}
                >
                  <span className="mr-2 text-snow/35">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </span>
                <span className="relative grid size-[11px] place-items-center">
                  {on && <span className="absolute inset-0 rounded-full bg-mint/50 [animation:ping-slow_1.6s_ease-out_infinite]" />}
                  <span
                    className={cn(
                      "block rounded-full transition-[background-color,scale] duration-400",
                      on ? "size-[11px] bg-mint" : i < idx ? "size-[7px] bg-mint/70" : "size-[7px] bg-snow/35 group-hover/stop:bg-snow",
                    )}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
