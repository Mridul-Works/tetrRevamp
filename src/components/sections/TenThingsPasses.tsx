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
        <div data-pass-head className="sticky top-[var(--hdr,0px)] z-20 transition-[top] duration-500 ease-out-expo -mx-4 bg-gradient-to-b from-ink from-70% to-ink/0 px-4 pb-6 pt-5 md:pt-6">
          <div ref={head} className="mx-auto max-w-[760px] text-center">
          <h2 className="section-title text-[32px] text-snow sm:text-[42px]">
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
              <li key={t.tag} data-pass className="sticky mb-8 drop-shadow-[0_-10px_22px_rgba(0,0,0,0.35)] transition-[top] duration-500 ease-out-expo last:mb-0" style={{ top: `min(calc(var(--hdr, 0px) + var(--pass-top, 180px) + ${i * PEEK}px), calc(100svh - var(--h, 0px) - 16px))`, zIndex: i + 1 }}>
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
                  className="pass-ticket group relative grid origin-top cursor-pointer grid-cols-[minmax(0,1fr)_120px] bg-snow text-ink will-change-transform sm:grid-cols-[minmax(0,1fr)_220px]"
                >
                  {/* main ticket (the notches on the tear line are cut by .pass-ticket in globals.css) */}
                  <div className="flex min-w-0 flex-col">
                    {/* header band: deep green so the ticket's top edge and notch read against the ink section */}
                    <div className="flex items-center justify-between gap-3 bg-deep px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-snow md:px-7">
                      <span className="truncate">
                        <span className="sm:hidden">Pass</span>
                        <span className="hidden sm:inline">
                          Boarding pass <span className="text-snow/50">· Tetr College of Business</span>
                        </span>
                      </span>
                      <span className="shrink-0 text-mint">Flight TETR {pad(i + 1)}</span>
                    </div>

                    <div className="grid min-w-0 flex-1 md:grid-cols-[42%_minmax(0,1fr)]">
                      <div className="relative aspect-[16/10] overflow-hidden border-b border-ink/15 bg-cream md:aspect-auto md:border-b-0 md:border-r">
                        <Image
                          src={t.image}
                          alt=""
                          fill
                          quality={85}
                          sizes="(min-width: 1024px) 420px, 80vw"
                          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
                        />
                        <span className="absolute bottom-0 left-0 grid size-12 place-items-center bg-gold text-gold-ink transition-[width,height] duration-300 group-hover:size-14">
                          <svg viewBox="0 0 24 24" className="size-4 translate-x-px" fill="currentColor" aria-hidden="true">
                            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                          </svg>
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <div className="p-5 md:p-7">
                          <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-deep">{t.tag}</span>
                          <h3 className="mt-3 text-[clamp(22px,2.2vw,34px)] font-semibold leading-[1.1] tracking-[-0.022em] text-ink [text-wrap:balance] [&_.accent]:text-deep">
                            <Accented text={t.title} />
                          </h3>
                          <p className="mt-3 line-clamp-3 text-[14px] leading-[1.6] text-ink/70">{t.body}</p>
                        </div>

                        {/* ruled field rows, like the printed data on a real pass */}
                        <dl className="mt-auto grid grid-cols-2 border-t border-ink/15 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50 sm:grid-cols-3 [&>div]:border-r [&>div]:border-ink/15 [&>div:last-child]:border-r-0 [&>div]:px-5 [&>div]:py-3 md:[&>div]:px-7">
                          <div>
                            <dt>Gate</dt>
                            <dd className="mt-1 text-[14px] font-semibold tracking-normal text-ink">{pad(i + 1)}</dd>
                          </div>
                          <div>
                            <dt>Seat</dt>
                            <dd className="mt-1 text-[14px] font-semibold tracking-normal text-ink">{seat(i)}</dd>
                          </div>
                          <div className="hidden sm:block">
                            <dt>Status</dt>
                            <dd className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold tracking-normal text-deep">
                              <span className="size-1.5 bg-deep" /> Boarding
                            </dd>
                          </div>
                        </dl>

                        {stats.length > 0 ? (
                          <div className="flex gap-8 border-t border-ink/15 px-5 py-4 md:px-7">
                            {stats.map((s) => (
                              <div key={s.label}>
                                <b className="block text-[clamp(22px,2vw,30px)] font-semibold leading-none tracking-tight text-deep">{s.value}</b>
                                <small className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">{s.label}</small>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between border-t border-ink/15 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60 transition-colors group-hover:text-deep md:px-7">
                            Watch the story
                            <span className="h-px w-10 bg-current transition-[width] duration-500 ease-out-expo group-hover:w-16" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* stub: the dashed left border is the tear line */}
                  <div aria-hidden className="flex flex-col border-l-2 border-dashed border-ink/25 bg-cream font-mono uppercase tracking-[0.14em] text-ink/55">
                    <div className="bg-deep px-4 py-3 text-[10.5px] tracking-[0.18em] text-snow sm:px-6">
                      <span className="text-mint">{pad(i + 1)}</span>
                      <span className="text-snow/50"> / {pad(N)}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
                      <span className="text-[10.5px]">
                        Seat
                        <b className="mt-1 block font-serif text-[34px] font-normal leading-none tracking-normal text-ink sm:text-[56px]">{seat(i)}</b>
                      </span>
                      <dl className="grid gap-3 border-t border-ink/15 pt-4 text-[10px]">
                        <div>
                          <dt>Flight</dt>
                          <dd className="mt-0.5 text-[12.5px] tracking-normal text-ink">TETR {pad(i + 1)}</dd>
                        </div>
                        <div className="hidden sm:block">
                          <dt>Gate</dt>
                          <dd className="mt-0.5 truncate text-[12.5px] normal-case tracking-normal text-ink">{t.tag}</dd>
                        </div>
                        <div>
                          <dt>Class</dt>
                          <dd className="mt-0.5 text-[12.5px] tracking-normal text-ink">Builder</dd>
                        </div>
                      </dl>
                      <span className="mt-auto flex h-12 items-stretch gap-[2px] overflow-hidden opacity-85 sm:h-14">
                        {BARS.map((w, k) => (
                          <span key={k} className="shrink-0 bg-ink" style={{ width: w * 1.3 }} />
                        ))}
                      </span>
                    </div>
                  </div>

                  {/* darkens as the next pass covers this one */}
                  <div data-pass-dim className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
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
