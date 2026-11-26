import { LOGO } from "@/data/content";

/**
 * Opening curtain: logo + a filling hairline, then the panel lifts off the hero.
 * Pure CSS (see intro-* keyframes) so it runs before hydration and vanishes with reduced motion.
 */
export default function Intro() {
  return (
    <div aria-hidden="true" className="intro pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-ink">
      <div className="intro-mark flex flex-col items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt="" className="h-12 w-auto" />
        <span className="relative block h-px w-44 overflow-hidden bg-snow/15">
          <span className="intro-bar absolute inset-0 origin-left bg-mint" />
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-snow/50">Learn by doing · Across the globe</span>
      </div>
    </div>
  );
}
