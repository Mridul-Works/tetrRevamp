"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { v2Contact } from "@/data/v2";

/** Phone-width action bar: appears once the hero has scrolled away, hides while a lead form is on screen. */
export default function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight;
      const pastHero = window.scrollY > vh * 0.9;
      const formVisible = Array.from(document.querySelectorAll<HTMLElement>("[data-leadform]")).some((f) => {
        const r = f.getBoundingClientRect();
        return r.top < vh * 0.85 && r.bottom > vh * 0.15;
      });
      setShow(pastHero && !formVisible);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    // capture: true also catches scrolls Lenis drives on a wrapper rather than the window
    window.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-2 border-t border-snow/15 bg-forest p-3 text-cream transition-transform duration-300 md:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      aria-hidden={!show}
    >
      <a href="#lead" className="v2-mono inline-flex h-12 items-center justify-center bg-gold font-semibold text-gold-ink">
        Get fees & scholarships
      </a>
      <a href={v2Contact.whatsapp} target="_blank" rel="noreferrer" className="v2-mono inline-flex h-12 items-center justify-center border border-snow/30 px-4">
        {v2Contact.hasWhatsapp ? "WhatsApp" : "Contact"}
      </a>
    </div>
  );
}
