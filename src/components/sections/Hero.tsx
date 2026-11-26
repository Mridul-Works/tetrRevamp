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
import { usePointerParallax } from "@/lib/pointer";
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
  // photo and copy drift in opposite directions toward the pointer
  usePointerParallax(root, 30);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % hero.images.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const onReady = useCallback(() => setGlReady(true), []);

  useGSAP(
    () => {
      // starts as the intro curtain (see <Intro />) lifts
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // The copy, badge and buttons come in alongside the headline rather than after it,
      // so everything in the hero is on screen within about a second of the curtain lifting.
      const tl = gsap.timeline({ delay: reduced ? 0.1 : 1.0 });
      tl.from("[data-word]", { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.04 })
        .from("[data-hero-fade]", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 }, 0.2)
        .from("[data-hero-rule]", { scaleX: 0, duration: 1.2, ease: "expo.out" }, 0.3);

      // Frame tightens and content drifts up as the hero scrolls away
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-frame]", { clipPath: "inset(3% 3% 0% 3% round 4px)", ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-content]", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative min-h-[100svh] bg-ink">
      <div
        ref={viewRef}
        data-hero-frame
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      >
        {/* First photo paints immediately; the WebGL slideshow fades in over it. Oversized so the parallax drift never shows an edge. */}
        <div data-depth="-0.6" className="absolute -inset-[3%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.images[0]} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
          <div className={cn("absolute inset-0 transition-opacity duration-1000", glReady ? "opacity-100" : "opacity-0")}>
            <HeroSlides images={hero.images} index={index} active={inView} onReady={onReady} />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        <div className="grain pointer-events-none absolute inset-0" />
      </div>

      {/* Fills the screen with the copy at the bottom, but the top padding clears the fixed header:
          on short screens the section grows instead of pushing the copy up under the header. */}
      <div data-hero-content data-depth="0.35" className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-10 pt-[112px] md:pb-12 md:pt-[124px] [@media(max-height:720px)]:pb-8">
        <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 text-mint [@media(max-height:720px)]:mb-4">
          <span className="h-px w-10 bg-mint" />
          {hero.eyebrow}
        </p>
        {/* sized by width and height, so a wide but short window doesn't get a giant headline */}
        <h1 className="text-[clamp(34px,min(5.2vw,9.5svh),84px)] font-semibold leading-[1] tracking-[-0.035em] text-snow">
          {hero.titleA.split(" by ").map((line, i) => (
            <span key={line} className="block">
              <Words text={i ? `by ${line}` : line} />
            </span>
          ))}
          <span className="block pt-[0.06em] tracking-[-0.01em]">
            <Words text={hero.titleB} className="accent text-mint" />
          </span>
        </h1>
        <p data-hero-fade className="mt-7 max-w-[560px] text-[15.5px] leading-[1.65] text-snow/80 md:text-[17px] [@media(max-height:720px)]:mt-5">
          {hero.body}
        </p>

        <div data-hero-rule className="mt-8 h-px origin-left bg-snow/20 [@media(max-height:720px)]:mt-6" />

        <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-center md:justify-between [@media(max-height:720px)]:mt-5 [@media(max-height:720px)]:gap-4">
          <div data-hero-fade className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QS_BADGE} alt={hero.badgeAlt} className="h-[64px] w-auto md:h-[72px]" />
          </div>
          <div data-hero-fade className="flex flex-wrap gap-3">
            <GoldButton href={hero.handbook.href} icon={<Download width={16} height={16} />}>
              {hero.handbook.label}
            </GoldButton>
            <span className="inline-flex">
              <OutlineButton onClick={() => play({ title: hero.filmTitle })} icon={<Play width={14} height={14} />} cursor="Play">
                {hero.film}
              </OutlineButton>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
