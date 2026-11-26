"use client";

import { useState } from "react";
import Image from "next/image";
import { programTabs, programs, programsHeading, type ProgramTab } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Universities from "@/components/sections/Universities";
import { NavArrows, Pill } from "@/components/ui/Button";
import { ArrowUpRight, Clock } from "@/components/ui/icons";
import { useCarousel, useDragScroll } from "@/lib/hooks";

/** Bar widths (px) for each pass's decorative barcode. */
const BARS = [2, 1, 3, 1, 1, 2, 1, 4, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 3, 1];

export default function Programs() {
  const [tab, setTab] = useState<ProgramTab>("Bachelor's");
  const list = programs.filter((p) => p.tab === tab);
  const car = useCarousel<HTMLDivElement>();
  useDragScroll(car.ref);

  return (
    <section id="programs" aria-label="Programs" className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)] lg:motion-safe:pb-0">
      <div className="pointer-events-none absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-gold/[0.06] blur-[120px]" />
      <div className="container-x relative">
        <Heading {...programsHeading} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-5">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {programTabs.map((t) => (
              <Pill
                key={t}
                active={t === tab}
                onClick={() => {
                  setTab(t);
                  car.ref.current?.scrollTo({ left: 0 });
                  requestAnimationFrame(car.update);
                }}
              >
                {t}
              </Pill>
            ))}
          </div>
          <NavArrows name="program" onPrev={car.prev} onNext={car.next} prevDisabled={car.edges.start} nextDisabled={car.edges.end} />
        </div>

        <div
          ref={car.ref}
         
          className="no-scrollbar -mx-3 mt-4 flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto px-3 pb-12 pt-8 active:cursor-grabbing"
        >
          {list.map((p, i) => (
            <article
              key={p.titleA + p.titleB}
              data-card
              className="pass group relative flex w-[82%] shrink-0 snap-start flex-col rounded-sm bg-paper text-ink shadow-[0_24px_60px_rgba(0,0,0,.45)] transition-[translate,rotate,box-shadow] duration-500 ease-out-expo [animation:deal-in_.9s_var(--ease-out-expo)_both] hover:z-10 hover:shadow-[0_36px_80px_rgba(0,0,0,.6)] sm:w-[340px]"
              style={{ animationDelay: `${i * 90}ms`, "--tilt": `${i % 2 ? 1.6 : -1.6}deg` } as React.CSSProperties}
            >
              {/* photo */}
              <div className="p-3 pb-0">
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                  <Image
                    src={p.image}
                    alt={`${p.titleA} ${p.titleB}`}
                    fill
                    sizes="340px"
                    draggable={false}
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-ink/80 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-snow backdrop-blur">{p.degree}</span>
                </div>
              </div>

              {/* route line: You → the world */}
              <div className="flex items-end gap-3 px-5 pt-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">From</div>
                  <div className="text-[17px] font-semibold leading-tight">You</div>
                </div>
                <div className="relative mb-2.5 flex-1 border-t-2 border-dashed border-ink/20">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute left-0 top-0 size-5 -translate-y-1/2 rotate-90 bg-paper text-deep transition-[left] duration-[900ms] ease-out-expo group-hover:left-[calc(100%-20px)]">
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">To</div>
                  <div className="text-[17px] font-semibold leading-tight">{p.locations}</div>
                </div>
              </div>

              <h3 className="min-h-[3.9em] px-5 pt-4 text-[20px] font-semibold leading-[1.3] tracking-tight">
                {p.titleA} <span className="accent text-deep">{p.titleB}</span>
              </h3>

              {/* perforation with punched notches */}
              <div className="relative mx-5 mt-4 border-t-2 border-dashed border-ink/15">
                <span className="absolute -left-5 top-0 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
                <span className="absolute -right-5 top-0 size-6 -translate-y-1/2 translate-x-1/2 rounded-full bg-ink" />
              </div>

              {/* stub */}
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
                      <Clock width={12} height={12} /> Duration
                    </dt>
                    <dd className="mt-0.5 text-[14.5px] font-semibold">{p.duration}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">{p.deadlineLabel}</dt>
                    <dd className="mt-0.5 text-[14.5px] font-semibold">{p.deadline}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div aria-hidden="true" className="flex h-9 items-stretch gap-[2px] opacity-80">
                    {BARS.map((w, j) => (
                      <span key={j} className="bg-ink" style={{ width: w }} />
                    ))}
                  </div>
                  <a
                    href={p.href}
                    className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-ink py-1.5 pl-4 pr-1.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-snow transition-colors hover:bg-gold hover:text-gold-ink"
                  >
                    Explore
                    <span className="grid size-7 place-items-center rounded-xs bg-snow/15 transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight width={14} height={14} />
                    </span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Partner universities */}
      <Universities />
    </section>
  );
}
