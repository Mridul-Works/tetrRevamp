"use client";

import { useState } from "react";
import Image from "next/image";
import { programTabs, programs, programsHeading, type ProgramTab } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Universities from "@/components/sections/Universities";
import { NavArrows, Pill } from "@/components/ui/Button";
import { ArrowUpRight, Clock, MapPin } from "@/components/ui/icons";
import { useCarousel, useDragScroll } from "@/lib/hooks";

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
          className="no-scrollbar mt-8 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-4 active:cursor-grabbing"
        >
          {list.map((p, i) => (
            <article
              key={p.titleA + p.titleB}
              data-card
              className="group flex w-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-snow/10 bg-forest transition-colors duration-500 [animation:rise-in_.7s_var(--ease-out-expo)_both] hover:border-mint/40 sm:w-[420px]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={p.image}
                  alt={`${p.titleA} ${p.titleB}`}
                  fill
                  sizes="420px"
                  draggable={false}
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1 text-[12px] font-medium backdrop-blur">{p.degree}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[22px] font-semibold leading-[1.25] tracking-tight">
                  {p.titleA} <span className="accent text-mint">{p.titleB}</span>
                </h3>
                <p className="mt-3 text-[13px] text-byline">
                  {p.deadlineLabel}: <span className="text-snow">{p.deadline}</span>
                </p>
                <div className="mt-5 flex gap-5 border-t border-snow/10 pt-5 text-[13.5px] text-snow/85">
                  <span className="flex items-center gap-2">
                    <Clock width={16} height={16} className="text-mint" />
                    {p.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin width={16} height={16} className="text-mint" />
                    {p.locations}
                  </span>
                </div>
                <a
                  href={p.href}
                  className="mt-6 inline-flex items-center justify-between rounded-full border border-snow/20 py-2 pl-5 pr-2 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-gold hover:bg-gold hover:text-gold-ink"
                >
                  <span>Explore programme</span>
                  <span className="grid size-8 place-items-center rounded-full bg-snow/10 transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight width={15} height={15} />
                  </span>
                </a>
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
