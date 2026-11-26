"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LOGO, v2Nav } from "@/data/v2";

/**
 * Thin sticky bar. Over the dark hero it is transparent with light type;
 * once the hero scrolls away it becomes a frosted paper bar with ink type.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      setSolid(window.scrollY > window.innerHeight * 0.8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500",
        solid ? "v2-rule bg-[rgb(246_248_244/0.92)] text-[var(--v2-ink)] backdrop-blur-md" : "border-transparent text-cream",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Tetr College of Business">
          <img src={LOGO} alt="" className="h-7 w-auto" />
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {v2Nav.links.map((l) => (
            <a key={l.href} href={l.href} className="v2-mono relative text-[12px] transition-opacity hover:opacity-60">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={v2Nav.cta.href}
          className={cn(
            "v2-mono inline-flex h-10 items-center px-5 text-[11.5px] font-semibold transition-colors duration-500",
            solid ? "bg-[var(--v2-ink)] text-[var(--v2-paper)] hover:bg-gold hover:text-gold-ink" : "bg-gold text-gold-ink hover:bg-[#ffd75e]",
          )}
        >
          {v2Nav.cta.label}
        </a>
      </div>
      {/* how far down the page you are */}
      <div ref={bar} aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
    </header>
  );
}
