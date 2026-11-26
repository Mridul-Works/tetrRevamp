"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/cn";

/** Floating return-to-top button that appears once the page has been scrolled a little. */
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  const lenis = useLenis(({ progress }) => setShown(progress > 0.08));

  useEffect(() => {
    // fallback when Lenis is off (reduced motion)
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShown((max ? window.scrollY / max : 0) > 0.08);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className={cn(
        "group fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-sm border border-snow/15 bg-ink/70 text-snow backdrop-blur-md transition-[opacity,translate,background-color] duration-500 ease-out-expo hover:bg-mint hover:text-ink",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
