"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { tenThings } from "@/data/content";
import { Accented } from "@/components/ui/RichText";
import { useWordReveal, Words } from "@/components/ui/Heading";
import { usePlayVideo } from "@/components/ui/VideoModal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");
const plain = (s: string) => s.replace(/\*/g, "");
const N = tenThings.length;
/** Gap between the pinned heading and the first pass, and how far each later pass sits below the one before. */
const GAP = 20;
const PEEK = 14;
/** Seat letters skip I, as on a real seat map. */
const SEATS = "ABCDEFGHJK";
/** Stats for the passes whose thing has none in the content data. */
const FALLBACK_STATS: Record<string, { value: string; label: string }[]> = {
  "Brand Wars": [{ value: "$107K", label: "Raised last cohort" }],
  Millionaire: [{ value: "$10M", label: "Launchpad fund" }],
};
/** Bar widths for the stub's barcode. */
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 4, 1, 1, 2, 1, 3, 2, 1, 1, 1, 3, 1, 2, 2, 1, 4, 1, 2, 1, 3];
const seat = (i: number) => `${pad(i + 1)}${SEATS[i] ?? ""}`;

/**
 * "Ten things to know before you board": a centred heading, then a single centred column of
 * large boarding passes. Each pass sticks as it reaches the top and the next one slides over
 * it; covered passes sink back and dim, so the column collapses into a neat deck.
 */
export default function TenThingsPasses() {
  const root = useRef<HTMLElement>(null);
  const head = useWordReveal<HTMLDivElement>();
  const play = usePlayVideo();

  // The passes pin just under the heading, so track the heading's height (it changes with screen size).
  const stickAt = () => {
    const h = root.current?.querySelector<HTMLElement>("[data-pass-head]");
    return (h ? h.offsetHeight : 160) + GAP;
  };
  useEffect(() => {
    const el = root.current;
    const h = el?.querySelector<HTMLElement>("[data-pass-head]");
    if (!el || !h) return;
    const passes = Array.from(el.querySelectorAll<HTMLElement>("[data-pass]"));
    const last = passes[passes.length - 1];
    const set = () => {
      // each pass knows its own height, so it never pins with its bottom (the stats) below the screen
      passes.forEach((p) => p.style.setProperty("--h", `${p.offsetHeight}px`));
      el.style.setProperty("--pass-top", `${h.offsetHeight + GAP}px`);
      // How far the deck extends below the point where the heading would let go. Pulling the
      // heading's container up by this much makes heading and deck leave the screen together.
      el.style.setProperty("--pass-tail", `${(last?.offsetHeight ?? 0) + GAP + (N - 1) * PEEK}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(h);
    passes.forEach((p) => ro.observe(p));
    return () => ro.disconnect();
  }, []);

  const watch = (i: number) => play({ title: plain(tenThings[i].title), ...tenThings[i].video });

  useGSAP(
    () => {
      const passes = gsap.utils.toArray<HTMLElement>("[data-pass]");
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // As the next pass climbs over it, a pass sinks back and dims.
        passes.forEach((pass, i) => {
          const next = passes[i + 1];
          if (!next) return;
          const st = { trigger: next, start: "top bottom", end: () => `top ${stickAt() + (i + 1) * PEEK}px`, scrub: true, invalidateOnRefresh: true };
          gsap.fromTo(pass.querySelector("[data-pass-inner]"), { scale: 1 }, { scale: 0.94, ease: "none", scrollTrigger: st });
          gsap.fromTo(pass.querySelector("[data-pass-dim]"), { opacity: 0 }, { opacity: 0.5, ease: "none", scrollTrigger: st });
        });
        gsap.from("[data-pass-inner]", {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-pass-list]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="passes" aria-label="Ten things to know before you board" className="relative overflow-x-clip bg-ink py-[clamp(80px,9vw,140px)]">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />

      <div className="container-x relative flow-root">
        {/* heading: pinned to the top for as long as the passes are on screen */}
        <div data-pass-head className="sticky top-0 z-20 -mx-4 bg-gradient-to-b from-ink from-70% to-ink/0 px-4 pb-6 pt-5 md:pt-6">
          <div ref={head} className="mx-auto max-w-[760px] text-center">
          <h2 className="section-title text-[42px] text-snow">
            <Words text="Ten Things to Know" />
            <br />
            <Words text="Before You Board." className="accent" />
          </h2>
          </div>
        </div>

        {/* the centred column of passes */}
        <ul data-pass-list className="relative z-30 mx-auto mt-8 mb-[calc(-1*var(--pass-tail,0px))] w-full max-w-[1120px] md:mt-12" aria-label="Ten things to know">
          {tenThings.map((t, i) => {
            const stats = t.stats.length ? t.stats : (FALLBACK_STATS[t.tag] ?? []);
            return (
              <li key={t.tag} data-pass className="sticky mb-8 last:mb-0" style={{ top: `min(calc(var(--pass-top, 180px) + ${i * PEEK}px), calc(100svh - var(--h, 0px) - 16px))`, zIndex: i + 1 }}>
                <div
                  data-pass-inner
                  role="button"
                  tabIndex={0}
                  aria-label={`Pass ${pad(i + 1)}, seat ${seat(i)}. ${t.tag}: ${plain(t.title)}. Watch the story`}
                  onClick={() => watch(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      watch(i);
                    }
                  }}
                  className="group relative grid origin-top cursor-pointer grid-cols-[minmax(0,1fr)_104px] rounded-[22px] bg-snow text-ink shadow-[0_-20px_60px_rgba(0,0,0,.5)] will-change-transform sm:grid-cols-[minmax(0,1fr)_200px] md:min-h-[clamp(380px,calc(100svh-400px),480px)]"
                >
                  {/* punched notches on the tear line, in the section colour */}
                  <span aria-hidden className="absolute right-[90px] top-0 z-10 size-[28px] -translate-y-1/2 rounded-full bg-ink sm:right-[186px]" />
                  <span aria-hidden className="absolute bottom-0 right-[90px] z-10 size-[28px] translate-y-1/2 rounded-full bg-ink sm:right-[186px]" />

                  {/* main: photo | story */}
                  <div className="grid min-w-0 md:grid-cols-[44%_minmax(0,1fr)]">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-tl-[22px] bg-cream md:aspect-auto md:rounded-bl-[22px]">
                      <Image
                        src={t.image}
                        alt=""
                        fill
                        quality={85}
                        sizes="(min-width: 1024px) 420px, 80vw"
                        className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
                      />
                      <span className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-sm bg-gold text-gold-ink shadow-md transition-transform duration-300 group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="size-4 translate-x-px" fill="currentColor" aria-hidden="true">
                          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col p-6 md:p-9">
                      <span className="truncate font-mono text-[11px] uppercase tracking-[0.16em] text-deep">
                        Flight TETR {pad(i + 1)} · {t.tag}
                      </span>
                      <h3 className="mt-4 text-[clamp(24px,2.3vw,36px)] font-semibold leading-[1.1] tracking-[-0.022em] text-ink [text-wrap:balance] [&_.accent]:text-deep">
                        <Accented text={t.title} />
                      </h3>
                      <p className="mt-4 line-clamp-4 text-[14.5px] leading-[1.6] text-ink/70">{t.body}</p>
                      {stats.length > 0 && (
                        <div className="mt-auto flex gap-8 border-t border-ink/10 pt-5">
                          {stats.map((s) => (
                            <div key={s.label}>
                              <b className="block text-[clamp(22px,2vw,30px)] font-semibold leading-none tracking-tight text-deep">{s.value}</b>
                              <small className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">{s.label}</small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* stub: the dashed left border is the tear line */}
                  <div aria-hidden className="flex flex-col justify-between border-l-2 border-dashed border-ink/20 p-4 font-mono uppercase tracking-[0.14em] text-ink/55 sm:p-7">
                    <span className="text-[11px]">
                      Seat
                      <b className="mt-1.5 block font-serif text-[34px] font-normal leading-none tracking-normal text-ink sm:text-[60px]">{seat(i)}</b>
                    </span>
                    <span className="text-[12px] tabular-nums text-ink/70">
                      {pad(i + 1)} / {pad(N)}
                    </span>
                    <span className="flex h-12 items-stretch gap-[2px] overflow-hidden opacity-80 sm:h-14">
                      {BARS.map((w, k) => (
                        <span key={k} className="shrink-0 bg-ink" style={{ width: w * 1.3 }} />
                      ))}
                    </span>
                  </div>

                  {/* darkens as the next pass covers this one */}
                  <div data-pass-dim className="pointer-events-none absolute inset-0 rounded-[22px] bg-ink opacity-0" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* gives back the space the deck overhangs below the heading's container */}
      <div aria-hidden style={{ height: "var(--pass-tail, 0px)" }} />
    </section>
  );
}
