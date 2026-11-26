"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { tenThings, tenThingsIntro } from "@/data/content";
import { Accented } from "@/components/ui/RichText";
import { useWordReveal, Words } from "@/components/ui/Heading";
import { usePlayVideo } from "@/components/ui/VideoModal";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const [TITLE_A, TITLE_B] = tenThingsIntro.title.split(" About ");
const pad = (n: number) => String(n).padStart(2, "0");
const plain = (s: string) => s.replace(/\*/g, "");
const N = tenThings.length;
/** Where the first card sticks, and how far each later card sits below the one before. */
const STICK = 104;
const PEEK = 16;
/** Row height in the index list. */
const ITEM_H = 54;

/**
 * The ten things as a column of cards beside a sticky heading. Each card sticks as it reaches
 * the top, and the next one slides up over it; covered cards sink back and dim, so the column
 * collapses into a neat deck. The index on the left follows the card on top and jumps to any card.
 */
export default function TenThings() {
  const root = useRef<HTMLElement>(null);
  const head = useWordReveal<HTMLDivElement>();
  const play = usePlayVideo();
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  const watch = (i: number) => play({ title: plain(tenThings[i].title), ...tenThings[i].video });

  const goTo = (i: number) => {
    const el = root.current?.querySelectorAll<HTMLElement>("[data-ten-card]")[i];
    if (!el) return;
    // the card's resting place in the flow, minus where it sticks
    const y = el.offsetTop + (el.offsetParent as HTMLElement).getBoundingClientRect().top + window.scrollY - (STICK + i * PEEK);
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-ten-card]");
      const mm = gsap.matchMedia();

      // Which card is on top
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // As the next card climbs over it, a card sinks back and dims.
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const inner = card.querySelector("[data-ten-inner]");
          const dim = card.querySelector("[data-ten-dim]");
          const st = { trigger: next, start: "top bottom", end: `top ${STICK + (i + 1) * PEEK}px`, scrub: true };
          gsap.fromTo(inner, { scale: 1 }, { scale: 0.92, ease: "none", scrollTrigger: st });
          gsap.fromTo(dim, { opacity: 0 }, { opacity: 0.55, ease: "none", scrollTrigger: st });
        });
        gsap.from("[data-ten-inner]", {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-ten-list]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="10 things to know about Tetr" className="relative overflow-x-clip bg-ink py-[clamp(80px,9vw,140px)]">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />

      <div className="container-x relative grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
        {/* sticky heading + index */}
        <div className="lg:sticky lg:top-[104px] lg:self-start">
          <div ref={head}>
            <h2 className="section-title text-snow">
              <Words text={TITLE_A} />
              <br />
              <Words text={`About ${TITLE_B}`} className="accent" />
            </h2>
            <p data-fade className="mt-6 max-w-[460px] text-[15.5px] leading-[1.65] text-byline">
              {tenThingsIntro.body}
            </p>
          </div>

          {/* a short window onto the list: it scrolls so the current item sits in the middle, fading at both edges */}
          <div
            className="relative mt-10 hidden h-[300px] overflow-hidden lg:block"
            style={{ maskImage: "linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)" }}
          >
            <ol
              aria-label="Jump to a thing"
              className="transition-transform duration-700 ease-out-expo"
              style={{ transform: `translateY(${150 - ITEM_H / 2 - active * ITEM_H}px)` }}
            >
              {tenThings.map((t, i) => (
                <li key={t.tag}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active || undefined}
                    style={{ height: ITEM_H }}
                    className={cn(
                      "group flex w-full items-center gap-4 border-b border-snow/10 text-left transition-[color,opacity] duration-500",
                      i === active ? "text-snow" : "text-snow/45 hover:text-snow/80",
                    )}
                  >
                    <span className={cn("w-7 font-mono text-[13px] tabular-nums transition-colors", i === active ? "text-mint" : "")}>{pad(i + 1)}</span>
                    <span className={cn("flex-1 font-semibold uppercase tracking-[0.12em] transition-[font-size] duration-500", i === active ? "text-[19px]" : "text-[16px]")}>
                      {t.tag}
                    </span>
                    <span className={cn("h-px bg-mint transition-all duration-500 ease-out-expo", i === active ? "w-12 opacity-100" : "w-0 opacity-0")} />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* the column of cards */}
        <div data-ten-list className="relative">
          {tenThings.map((t, i) => (
            <article
              key={t.tag}
              data-ten-card
              className="sticky mb-6 last:mb-0"
              style={{ top: STICK + i * PEEK, zIndex: i + 1 }}
            >
              <div
                data-ten-inner
                role="button"
                tabIndex={0}
                aria-label={`${pad(i + 1)}. ${t.tag}: ${plain(t.title)}. Watch the story`}
                onClick={() => watch(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    watch(i);
                  }
                }}
                className="group relative flex h-[clamp(460px,68svh,600px)] origin-top cursor-pointer flex-col justify-between overflow-hidden rounded-[22px] bg-forest p-5 shadow-[0_-20px_60px_rgba(0,0,0,.5)] ring-1 ring-snow/10 will-change-transform md:p-8"
              >
                <Image
                  src={t.image}
                  alt=""
                  fill
                  quality={85}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(8_18_14/0.95)_0%,rgb(8_18_14/0.65)_40%,rgb(8_18_14/0.05)_72%),linear-gradient(to_bottom,rgb(8_18_14/0.5),transparent_24%)]" />

                {/* top row */}
                <div className="relative flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2.5 rounded-full bg-ink/55 py-1.5 pl-1.5 pr-4 ring-1 ring-snow/15 backdrop-blur-md">
                    <span className="grid size-7 place-items-center rounded-full bg-mint font-mono text-[11px] font-semibold text-ink">{pad(i + 1)}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-snow">{t.tag}</span>
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-snow/80 drop-shadow-[0_1px_8px_rgba(0,0,0,.6)]">
                    {pad(i + 1)} <span className="text-snow/45">/ {pad(N)}</span>
                  </span>
                </div>

                {/* story */}
                <div className="relative max-w-[620px]">
                  <h3 className="text-[clamp(24px,2.3vw,36px)] font-semibold leading-[1.1] tracking-[-0.022em] text-snow [text-wrap:balance]">
                    <Accented text={t.title} />
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[14.5px] leading-[1.6] text-snow/75">{t.body}</p>
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-snow/15 pt-5">
                    {t.stats.length > 0 ? (
                      <dl className="flex gap-8">
                        {t.stats.map((s) => (
                          <div key={s.label}>
                            <dt className="text-[clamp(22px,2vw,30px)] font-semibold leading-none tracking-tight text-mint">{s.value}</dt>
                            <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-snow/60">{s.label}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-2.5 rounded-sm bg-gold py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-gold-ink transition-transform duration-300 group-hover:scale-[1.04]">
                      <span className="grid size-7 place-items-center rounded-xs bg-ink text-gold">
                        <svg viewBox="0 0 24 24" className="size-3 translate-x-px" fill="currentColor" aria-hidden="true">
                          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                        </svg>
                      </span>
                      Watch the story
                    </span>
                  </div>
                </div>

                {/* darkens as the next card covers this one */}
                <div data-ten-dim className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
