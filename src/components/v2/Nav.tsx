"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { LOGO, v2Nav } from "@/data/v2";

/** Thin sticky bar: Tetr logo left, three links centre, one hard-edged gold CTA right. */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        solid ? "v2-rule bg-[rgb(246_248_244/0.92)] backdrop-blur-md" : "border-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Tetr College of Business">
          <img src={LOGO} alt="" className="h-7 w-auto" />
          <span className="v2-mono v2-mute hidden sm:inline">{v2Nav.mark}</span>
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
          className="v2-mono inline-flex h-10 items-center bg-gold px-5 text-[11.5px] font-semibold text-gold-ink transition-colors hover:bg-[var(--v2-ink)] hover:text-[var(--v2-paper)]"
        >
          {v2Nav.cta.label}
        </a>
      </div>
    </header>
  );
}
