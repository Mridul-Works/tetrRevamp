"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Postmark from "@/components/ui/Postmark";
import { PlayButton, usePlayVideo } from "@/components/ui/VideoModal";
import { usePointerParallax } from "@/lib/pointer";
import { cn } from "@/lib/cn";
import { QS_BADGE, v2Countries, v2Hero } from "@/data/v2";
import { InlineCountdown } from "./Countdown";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stamp = { id: number; x: number; y: number; place: string; tilt: number; color: string };

/** Magnetic gold CTA: pulls toward the pointer, arrow slides on hover. */
function Cta({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.16}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      }}
      onPointerLeave={() => ref.current && (ref.current.style.transform = "")}
      className="group/cta v2-mono relative inline-flex h-14 w-full items-center justify-between gap-4 bg-gold pr-3 pl-6 whitespace-nowrap text-[12.5px] font-semibold text-gold-ink transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:bg-[#ffd75e] sm:w-auto sm:justify-start sm:pl-7"
    >
      {label}
      <span className="grid size-9 place-items-center bg-gold-ink/10 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" aria-hidden>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  );
}

/**
 * The opening frame. One idea, three lines, one button. Headline lines rise out of masks,
 * the photo stage settles into place, and the whole frame tightens as you scroll away.
 * It also plays: hover a city on the base line and the stage flies there; click the
 * stage and it stamps your passport.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const play = usePlayVideo();
  const [stop, setStop] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const count = useRef(0);
  usePointerParallax(root, 28);

  const visit = (n: number | null) => {
    setStop(n);
    if (n !== null) setSeen((s) => (s.includes(n) ? s : [...s, n]));
  };

  const stampIt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const n = count.current++;
    setStamps((s) => [
      ...s.slice(-7),
      {
        id: n,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
        place: v2Countries[n % v2Countries.length].city,
        tilt: -14 + ((n * 37) % 28),
        color: n % 2 ? "var(--color-gold)" : "var(--color-cream)",
      },
    ]);
  };

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
      tl.from("[data-photo]", { clipPath: "inset(100% 0 0 0)", scale: 1.12, duration: 1.6, stagger: 0.12 })
        .from("[data-line]", { yPercent: 110, duration: 1.3, stagger: 0.09 }, "-=1.25")
        .from("[data-fade]", { y: 22, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08 }, "-=0.9")
        .from("[data-rule]", { scaleX: 0, transformOrigin: "left", duration: 1.2 }, "<");

      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-frame]", { clipPath: "inset(0 2.5% 6% 2.5% round 4px)", ease: "none", scrollTrigger: st });
      gsap.to("[data-content]", { yPercent: -14, opacity: 0.15, ease: "none", scrollTrigger: st });
      gsap.to("[data-stage]", { yPercent: 10, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  const at = stop === null ? null : v2Countries[stop];

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] bg-[var(--v2-paper)]">
      <div data-frame className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-forest text-cream" style={{ clipPath: "inset(0 0 0 0)" }}>
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
        {/* soft light in the corner; it takes the colour of the city you are hovering */}
        <div className="pointer-events-none absolute -top-40 -left-40 size-[620px] rounded-full opacity-[0.14] blur-3xl transition-colors duration-700" style={{ background: at?.accent ?? "var(--color-mint)" }} />

        {/* photo stage: click it to stamp your passport */}
        <div data-stage className="absolute inset-0 lg:left-[52%]" onClick={stampIt}>
          <figure data-photo data-depth="0.35" className="absolute inset-y-[8%] right-0 left-[6%] overflow-hidden lg:inset-y-[10%] lg:right-[6%] lg:left-0" style={{ clipPath: "inset(0 0 0 0)" }}>
            <img src={v2Hero.photos.main.src} alt={v2Hero.photos.main.alt} fetchPriority="high" className="size-full object-cover object-[68%_center] opacity-45 lg:object-center lg:opacity-90" />
            {/* the city you hover on the base line fades in over the main shot */}
            {seen.map((n) => (
              <img
                key={n}
                src={v2Countries[n].landmark.image}
                alt=""
                className={cn("absolute inset-0 size-full object-cover transition-[opacity,scale] duration-700 ease-[var(--ease-out-expo)]", stop === n ? "scale-100 opacity-100" : "scale-105 opacity-0")}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/50 to-transparent lg:from-forest/60 lg:via-transparent" />
            {at && (
              <p key={at.name} className="v2-mono absolute right-4 bottom-4 hidden bg-ink/70 px-3 py-2 text-cream backdrop-blur-sm [animation:rise-in_.5s_var(--ease-out-expo)_both] lg:block">
                Term {at.term} <span className="mx-1.5 opacity-40">/</span> <span style={{ color: at.accent }}>{at.landmark.title}</span>
              </p>
            )}
          </figure>
          <figure data-photo data-depth="0.9" className="absolute bottom-[12%] left-[3%] hidden w-[24%] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,.45)] lg:block" style={{ clipPath: "inset(0 0 0 0)" }}>
            <img src={v2Hero.photos.a.src} alt={v2Hero.photos.a.alt} className="aspect-[4/5] w-full object-cover" />
            <Postmark place={v2Hero.photos.a.place} color="var(--color-cream)" tilt={-9} className="absolute -top-2 -right-4 w-[120px]" />
          </figure>
          <figure data-photo data-depth="0.6" className="absolute top-[15%] right-[3%] hidden w-[21%] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,.45)] lg:block" style={{ clipPath: "inset(0 0 0 0)" }}>
            <img src={v2Hero.photos.b.src} alt={v2Hero.photos.b.alt} className="aspect-[4/5] w-full object-cover" />
            <Postmark place={v2Hero.photos.b.place} color="var(--color-gold)" tilt={7} className="absolute -right-3 -bottom-3 w-[120px]" />
          </figure>

          {/* stamps you have slapped on the stage */}
          {stamps.map((s) => (
            <div key={s.id} className="pointer-events-none absolute w-[150px] -translate-x-[35%] -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <Postmark place={s.place} color={s.color} tilt={s.tilt} className="w-full drop-shadow-[0_2px_6px_rgba(0,0,0,.5)]" />
            </div>
          ))}
          {stamps.length === 0 && !at && (
            <p data-fade className="v2-mono pointer-events-none absolute right-[7%] bottom-[11.5%] hidden items-center gap-2 text-cream/70 lg:flex">
              <span className="size-1.5 rounded-full bg-gold [animation:ping-slow_1.8s_ease-out_infinite]" />
              Click anywhere to stamp your passport
            </p>
          )}
        </div>

        {/* copy */}
        <div data-content className="container-x pointer-events-none relative z-10 flex flex-1 flex-col justify-center pt-24 pb-16 lg:pt-28">
          <div className="pointer-events-auto lg:max-w-[50%]">
            <div data-fade className="mb-8 flex items-center gap-4">
              <img src={QS_BADGE} alt={v2Hero.badgeAlt} className="h-8 w-auto" />
              <p className="v2-mono text-cream/70">
                <span className="hidden sm:inline">
                  {v2Hero.eyebrow} <span className="mx-2 text-cream/30">/</span>
                </span>
                <span className="text-mint">{v2Hero.intake}</span>
              </p>
            </div>

            <h1 className="v2-display text-[clamp(40px,5.4vw,96px)] leading-[0.86] whitespace-nowrap text-snow">
              <span className="block overflow-hidden pb-[0.04em]">
                <span data-line className="block">{v2Hero.title.a}</span>
              </span>
              <span className="block overflow-hidden py-[0.06em]">
                <span data-line className="accent block normal-case transition-colors duration-700" style={{ fontSize: "0.8em", lineHeight: 0.95, color: at?.accent ?? "var(--color-mint)" }}>
                  {v2Hero.title.accent}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">
                  in{" "}
                  {at ? (
                    <span key={at.name} className="inline-block [animation:rise-in_.45s_var(--ease-out-expo)_both]" style={{ color: at.accent }}>
                      {at.city}
                    </span>
                  ) : (
                    "7 countries"
                  )}
                </span>
              </span>
            </h1>

            <div className="mt-8 flex flex-col gap-7 lg:mt-10">
              <p data-fade className="max-w-[30ch] text-[clamp(17px,1.4vw,21px)] leading-[1.4] text-cream/75">{v2Hero.body}</p>
              <div data-fade className="flex flex-wrap items-center gap-x-8 gap-y-5">
                <Cta href={v2Hero.cta.href} label={v2Hero.cta.label} />
                <div className="group/film flex items-center gap-3">
                  <PlayButton label={v2Hero.film.label} onClick={() => play({ title: v2Hero.film.title })} size={48} />
                  <button type="button" onClick={() => play({ title: v2Hero.film.title })} className="v2-mono text-cream/80 underline-offset-4 hover:underline group-hover/film:underline">
                    {v2Hero.film.label}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* base line: countdown, the seven stops (hover one), scroll cue */}
        <div className="container-x relative z-10 pb-6">
          <div data-rule className="h-px w-full bg-cream/15" />
          <div className="flex items-center justify-between gap-6 pt-4">
            <InlineCountdown to={v2Hero.deadline} label={v2Hero.deadlineLabel} className="text-cream [&>span:first-child]:text-cream/50" />
            <ul className="v2-mono hidden items-center md:flex" onPointerLeave={() => visit(null)}>
              {v2Countries.map((c, n) => (
                <li key={c.name} className="flex items-center">
                  {n > 0 && <span aria-hidden className="size-1 rounded-full bg-cream/30" />}
                  <button
                    type="button"
                    onPointerEnter={() => visit(n)}
                    onFocus={() => visit(n)}
                    onBlur={() => visit(null)}
                    onClick={() => document.getElementById("route")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-2.5 py-2 transition-colors duration-300"
                    style={{ color: stop === n ? c.accent : "rgb(239 239 234 / .5)" }}
                  >
                    {c.city}
                  </button>
                </li>
              ))}
            </ul>
            <p className="v2-mono flex items-center gap-2 text-cream/50">
              {v2Hero.scroll}
              <span className="relative block h-8 w-px overflow-hidden bg-cream/20">
                <span className="absolute inset-x-0 top-0 h-1/2 bg-mint [animation:cue_1.6s_ease-in-out_infinite]" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
