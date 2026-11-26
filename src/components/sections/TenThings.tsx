"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { tenThings, tenThingsIntro } from "@/data/content";
import { Accented } from "@/components/ui/RichText";
import Heading from "@/components/ui/Heading";
import { NavArrows } from "@/components/ui/Button";
import { usePlayVideo } from "@/components/ui/VideoModal";
import { useAutoIndex, useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DURATION = 6500;
const [TITLE_A, TITLE_B] = tenThingsIntro.title.split(" About ");
const pad = (n: number) => String(n).padStart(2, "0");
const plain = (s: string) => s.replace(/\*/g, "");

/**
 * All ten things stand side by side as photo strips, in full colour, and the section's light
 * takes its colour from whichever photo is open. The open strip carries its story on a frosted
 * card and plays its video on click (a "Watch" disc follows the cursor). The deck advances on its
 * own until someone steers it or presses pause. On small screens the strips stack and open downwards.
 */
export default function TenThings() {
  const root = useRef<HTMLElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const play = usePlayVideo();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>("-20% 0px");
  const [held, setHeld] = useState(false); // pointer over the deck
  const [paused, setPaused] = useState(false); // user pressed pause
  const running = inView && !held && !paused;
  const { index, nonce, go } = useAutoIndex(tenThings.length, DURATION, running);

  const watch = (i: number) => play({ title: plain(tenThings[i].title), ...tenThings[i].video });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-strip]", {
          y: 90,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-deck]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // the "Watch" disc trails the cursor across the deck
  const onMove = (e: React.MouseEvent) => {
    const d = disc.current;
    if (!d) return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(d, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.45, ease: "power3.out", overwrite: "auto" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
    const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      watch(index);
      return;
    }
    if (!fwd && !back) return;
    e.preventDefault();
    const next = (index + (fwd ? 1 : -1) + tenThings.length) % tenThings.length;
    go(next);
    (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>("[role=tab]")[next]?.focus();
  };

  return (
    <section ref={root} aria-label="10 things to know about Tetr" className="relative overflow-hidden bg-ink py-[clamp(80px,9vw,140px)]">
      {/* ambient light: a heavily blurred copy of the open photo tints the whole section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {tenThings.map((t, i) => (
          <Image
            key={t.tag}
            src={t.image}
            alt=""
            fill
            sizes="240px"
            className={cn(
              "scale-125 object-cover blur-[90px] saturate-[1.6] transition-opacity duration-[1.4s] ease-out",
              i === index ? "opacity-[.42]" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(8_18_14/0.55)_30%,rgb(8_18_14/0.55)_70%,var(--color-ink)_100%)]" />
      </div>
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />

      <div ref={viewRef} className="container-x relative">
        <Heading line1={TITLE_A} line2={`About ${TITLE_B}`} byline={tenThingsIntro.body} />

        <div
          data-deck
          role="tablist"
          aria-label="10 things to know about Tetr"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onMouseMove={onMove}
          onKeyDown={onKey}
          className="relative mt-12 flex flex-col gap-2.5 lg:h-[clamp(520px,74vh,700px)] lg:flex-row [@media(pointer:fine)]:lg:cursor-none"
        >
          {tenThings.map((t, i) => {
            const on = i === index;
            return (
              <div
                key={t.tag}
                data-strip
                role="tab"
                tabIndex={on ? 0 : -1}
                aria-selected={on}
                aria-label={`${pad(i + 1)}. ${t.tag}: ${plain(t.title)}`}
                onMouseEnter={() => go(i)}
                onFocus={() => !on && go(i)}
                onClick={() => (on ? watch(i) : go(i))}
                className={cn(
                  "group relative min-w-0 cursor-pointer overflow-hidden rounded-[20px] bg-forest outline-offset-4",
                  "ring-1 ring-inset transition-[flex-grow,height,box-shadow] duration-[900ms] ease-out-expo lg:h-auto lg:basis-0",
                  on ? "h-[540px] ring-snow/15 shadow-[0_40px_90px_rgba(0,0,0,.5)] lg:grow-[9]" : "h-[64px] ring-snow/5 lg:grow",
                )}
              >
                {/* photo: full colour everywhere; the open one drifts in slowly */}
                <div key={on ? `img-${nonce}` : "img"} className={cn("absolute inset-0", on && "[animation:settle_8s_ease-out_both]")}>
                  <Image
                    src={t.image}
                    alt={on ? t.tag : ""}
                    fill
                    quality={85}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className={cn(
                      "object-cover transition-[transform,filter] duration-[1.2s] ease-out-expo",
                      on ? "scale-100" : "scale-[1.18] brightness-[.85] saturate-[.9] group-hover:scale-[1.1] group-hover:brightness-100 group-hover:saturate-100",
                    )}
                  />
                </div>

                {/* closed: only a short fade behind the label, so the photo reads clearly */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 transition-opacity duration-500",
                    "bg-[linear-gradient(to_right,rgb(8_18_14/0.75),transparent_70%)] lg:bg-[linear-gradient(to_top,rgb(8_18_14/0.8),rgb(8_18_14/0)_45%)]",
                    on ? "opacity-0" : "opacity-100",
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 flex items-center gap-4 px-4 transition-opacity duration-300 lg:flex-col lg:justify-between lg:px-0 lg:py-4",
                    on ? "pointer-events-none opacity-0" : "opacity-100 delay-300",
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/55 font-mono text-[11.5px] tabular-nums text-mint ring-1 ring-snow/15 backdrop-blur-md">
                    {pad(i + 1)}
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.14em] text-snow drop-shadow-[0_1px_8px_rgba(0,0,0,.6)] lg:rotate-180 lg:pb-2 lg:[writing-mode:vertical-rl]">
                    {t.tag}
                  </span>
                </div>

                {/* open: light vignettes only, story on a frosted card */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(8_18_14/0.55),rgb(8_18_14/0)_40%),linear-gradient(to_bottom,rgb(8_18_14/0.35),rgb(8_18_14/0)_22%)] transition-opacity duration-700",
                    on ? "opacity-100" : "opacity-0",
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col justify-between p-4 transition-opacity md:p-6",
                    on ? "opacity-100 delay-[350ms] duration-700" : "pointer-events-none opacity-0 duration-150",
                  )}
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="inline-flex items-center gap-2.5 rounded-full bg-ink/50 py-1.5 pl-1.5 pr-4 ring-1 ring-snow/15 backdrop-blur-md">
                      <span className="grid size-7 place-items-center rounded-full bg-mint font-mono text-[11px] font-semibold text-ink">{pad(i + 1)}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-snow">{t.tag}</span>
                    </span>
                    <span className="hidden select-none font-mono text-[12px] tabular-nums text-snow/80 drop-shadow-[0_1px_8px_rgba(0,0,0,.6)] md:block">
                      {pad(i + 1)} <span className="text-snow/45">/ {pad(tenThings.length)}</span>
                    </span>
                  </div>

                  <div
                    key={on ? `card-${nonce}` : "card"}
                    className={cn(
                      "rounded-[18px] bg-ink/60 p-5 ring-1 ring-snow/10 backdrop-blur-xl md:p-7 lg:w-[min(580px,44vw)]",
                      on && "[animation:rise-in_.9s_.3s_var(--ease-out-expo)_both]",
                    )}
                  >
                    <h3 className="text-[clamp(24px,2.5vw,38px)] font-semibold leading-[1.1] tracking-[-0.025em] text-snow [text-wrap:balance]">
                      <Accented text={t.title} />
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-[1.6] text-snow/80 md:text-[15px]">{t.body}</p>
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-snow/15 pt-5">
                      {t.stats.length > 0 && (
                        <dl className="flex gap-8 md:gap-10">
                          {t.stats.map((s) => (
                            <div key={s.label}>
                              <dt className="text-[clamp(24px,2.2vw,32px)] font-semibold leading-none tracking-tight text-mint">
                                {on ? <CountUp key={nonce} value={s.value} /> : s.value}
                              </dt>
                              <dd className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-snow/65">{s.label}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <button
                        type="button"
                        tabIndex={on ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          watch(i);
                        }}
                        className="group/btn inline-flex cursor-pointer items-center gap-3 rounded-full bg-gold py-1.5 pl-1.5 pr-5 text-[13px] font-semibold text-gold-ink transition-transform duration-300 hover:scale-[1.04]"
                      >
                        <span className="grid size-8 place-items-center rounded-full bg-ink text-gold transition-transform duration-500 group-hover/btn:rotate-[120deg]">
                          <svg viewBox="0 0 24 24" className="size-3.5 translate-x-px" fill="currentColor" aria-hidden="true">
                            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                          </svg>
                        </span>
                        Watch the story
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* cursor disc (fine pointers, desktop) */}
          <div
            ref={disc}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(pointer:fine)]:lg:block"
          >
            <div
              className={cn(
                "grid size-[88px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-gold-ink shadow-[0_12px_40px_rgba(0,0,0,.4)] transition-[scale,opacity] duration-300 ease-out-expo",
                held ? "scale-100 opacity-100" : "scale-0 opacity-0",
              )}
            >
              <span className="flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                </svg>
                Watch
              </span>
            </div>
          </div>
        </div>

        {/* controls: segmented progress, pause, arrows */}
        <div className="mt-6 flex items-center gap-6">
          <div className="flex flex-1 gap-1.5" aria-hidden="true">
            {tenThings.map((t, i) => (
              <span key={t.tag} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-snow/12">
                {i < index && <span className="absolute inset-0 bg-snow/45" />}
                {i === index && (
                  <span
                    key={`${nonce}-${running}`}
                    className={cn("absolute inset-0 origin-left bg-mint", running ? "animate-progress" : "scale-x-0")}
                    style={{ "--progress-duration": `${DURATION}ms` } as React.CSSProperties}
                  />
                )}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-snow/20 text-snow transition-colors hover:border-mint hover:text-mint"
          >
            {paused ? (
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
            )}
          </button>
          <NavArrows name="thing" onPrev={() => go(index - 1)} onNext={() => go(index + 1)} />
        </div>
      </div>
    </section>
  );
}

/** Counts a display value ("$500K+", "30.6%", "1,100+") up from zero as its panel opens. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*?)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!el || !m || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, num, suffix] = m;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const fmt = (n: number) =>
      num.includes(",") ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n.toFixed(decimals);
    const state = { n: 0 };
    el.textContent = prefix + fmt(0) + suffix;
    const tw = gsap.to(state, {
      n: target,
      duration: 1.4,
      delay: 0.5,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = prefix + fmt(state.n) + suffix;
      },
    });
    return () => {
      tw.kill();
      el.textContent = value;
    };
  }, [value]);
  return <span ref={ref}>{value}</span>;
}
