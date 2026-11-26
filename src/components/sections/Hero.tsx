"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { QS_BADGE, hero } from "@/data/content";
import { GoldButton, OutlineButton } from "@/components/ui/Button";
import { Words } from "@/components/ui/Heading";
import { Download, Play } from "@/components/ui/icons";
import { usePlayVideo } from "@/components/ui/VideoModal";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroSlides = dynamic(() => import("@/components/three/HeroSlides"), { ssr: false });

const INTERVAL = 5000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [glReady, setGlReady] = useState(false);
  const play = usePlayVideo();
  const root = useRef<HTMLElement>(null);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>("0px");

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % hero.images.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const onReady = useCallback(() => setGlReady(true), []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from("[data-word]", { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.05 })
        .from("[data-hero-fade]", { y: 28, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1 }, "-=0.9")
        .from("[data-hero-rule]", { scaleX: 0, duration: 1.4, ease: "expo.out" }, "<");

      // Frame tightens and content drifts up as the hero scrolls away
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-frame]", { clipPath: "inset(3% 3% 0% 3% round 28px)", ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-content]", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative h-[100svh] min-h-[640px] bg-ink">
      <div
        ref={viewRef}
        data-hero-frame
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      >
        {/* First photo paints immediately; the WebGL slideshow fades in over it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.images[0]} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
        <div className={cn("absolute inset-0 transition-opacity duration-1000", glReady ? "opacity-100" : "opacity-0")}>
          <HeroSlides images={hero.images} index={index} active={inView} onReady={onReady} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        <div className="grain pointer-events-none absolute inset-0" />
      </div>

      <div data-hero-content className="container-x relative z-10 flex h-full flex-col justify-end pb-10 md:pb-12">
        <h1 className="max-w-[1100px] text-[clamp(40px,6.2vw,96px)] font-semibold leading-[1.02] tracking-[-0.025em]">
          <Words text={hero.titleA} />
          <br />
          <Words text={hero.titleB} className="accent text-[1.05em] text-snow" />
        </h1>
        <p data-hero-fade className="mt-6 max-w-[640px] text-[16px] leading-[1.6] text-snow/85 md:text-[18px]">
          {hero.body}
        </p>

        <div data-hero-rule className="mt-9 h-px origin-left bg-snow/20" />

        <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div data-hero-fade className="flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QS_BADGE} alt={hero.badgeAlt} className="h-[64px] w-auto md:h-[72px]" />
            <SlideCounter index={index} total={hero.images.length} />
          </div>
          <div data-hero-fade className="flex flex-wrap gap-3">
            <GoldButton href={hero.handbook.href} icon={<Download width={16} height={16} />}>
              {hero.handbook.label}
            </GoldButton>
            <OutlineButton onClick={() => play({ title: hero.filmTitle })} icon={<Play width={14} height={14} />}>
              {hero.film}
            </OutlineButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideCounter({ index, total }: { index: number; total: number }) {
  return (
    <div className="hidden items-center gap-3 border-l border-snow/15 pl-5 font-mono text-[12px] text-snow/70 sm:flex">
      <span className="tabular-nums text-snow">{String(index + 1).padStart(2, "0")}</span>
      <span className="relative h-px w-16 overflow-hidden bg-snow/20">
        <span
          key={index}
          className="absolute inset-0 origin-left animate-progress bg-mint"
          style={{ "--progress-duration": `${INTERVAL}ms` } as React.CSSProperties}
        />
      </span>
      <span className="tabular-nums">{String(total).padStart(2, "0")}</span>
    </div>
  );
}
