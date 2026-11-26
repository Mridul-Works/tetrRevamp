"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { cn } from "@/lib/cn";

/**
 * Marquee that listens to the page: it drifts at `speed` px/s on its own, surges with scroll
 * velocity and reverses when you scroll back up. Two copies of the children slide as one track.
 */
export default function VelocityMarquee({
  children,
  speed = 60,
  reverse,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const boost = useRef(0);
  const hover = useRef(false);

  useLenis(({ velocity }) => {
    // velocity is px/frame-ish; fold it into a boost that decays each tick below
    boost.current = gsap.utils.clamp(-14, 14, velocity * 0.12);
  });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0;
    let dir = reverse ? 1 : -1;
    const tick = (_t: number, dt: number) => {
      const half = el.scrollWidth / 2;
      if (!half) return;
      const b = boost.current;
      if (Math.abs(b) > 0.05) dir = b * (reverse ? -1 : 1) > 0 ? -1 : 1; // scrolling down keeps the base direction
      const v = reduced ? 0 : (hover.current ? speed * 0.25 : speed) * (1 + Math.abs(b)) * (dt / 1000);
      x += dir * v;
      // wrap seamlessly
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      boost.current *= 0.9;
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, reverse]);

  return (
    <div
      className={cn("mask-fade-x overflow-hidden", className)}
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
    >
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
