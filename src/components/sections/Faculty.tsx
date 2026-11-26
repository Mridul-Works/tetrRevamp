"use client";

import { useState } from "react";
import Image from "next/image";
import { faculty, facultyHeading, facultyMix, masterclasses, type FacultyGroup } from "@/data/content";
import Heading, { useWordReveal, Words } from "@/components/ui/Heading";
import { GoldButton, NavArrows } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";
import { useCarousel, useDragScroll } from "@/lib/hooks";
import { useSpotlight } from "@/lib/pointer";
import Tilt from "@/components/ui/Tilt";
import { cn } from "@/lib/cn";

export default function Faculty() {
  const [group, setGroup] = useState<FacultyGroup | null>(null);
  const list = group ? faculty.filter((f) => f.group === group) : faculty;

  return (
    <section id="faculty" aria-label="Faculty" className="relative bg-cream py-[clamp(96px,9vw,144px)] text-ink">
      <div className="container-x">
        <Heading tone="light" {...facultyHeading} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14">
          {/* Mix filter */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-deep">{facultyHeading.mixLabel}</span>
              {group && (
                <button type="button" onClick={() => setGroup(null)} className="text-[12.5px] font-semibold text-deep underline underline-offset-4">
                  {facultyHeading.showAll}
                </button>
              )}
            </div>
            {/* proportion bar */}
            <div className="mt-4 flex h-2 overflow-hidden">
              {facultyMix.map((m) => (
                <span
                  key={m.key}
                  style={{ width: m.pct }}
                  className={cn("transition-opacity duration-300", m.key === "industry" ? "bg-deep" : m.key === "fulltime" ? "bg-mint" : "bg-gold", group && group !== m.key && "opacity-25")}
                />
              ))}
            </div>
            <div className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
              {facultyMix.map((m) => {
                const on = m.key === group;
                const count = faculty.filter((f) => f.group === m.key).length;
                return (
                  <button
                    key={m.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setGroup(on ? null : m.key)}
                    className={cn("group grid w-full grid-cols-[72px_1fr] gap-4 py-5 text-left transition-colors", on ? "text-ink" : "text-ink/75 hover:text-ink")}
                  >
                    <span className={cn("font-serif text-[40px] italic leading-none transition-colors", on ? "text-deep" : "text-ink/40 group-hover:text-deep")}>
                      {m.pct}
                    </span>
                    <span>
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-[16px] font-semibold">{m.title}</span>
                        <span className="shrink-0 text-[12px] text-byline-light">{count} profiles</span>
                      </span>
                      <span className="mt-1 block text-[13.5px] leading-[1.55] text-byline-light">{m.body}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <GoldButton href={facultyHeading.cta.href} className="mt-7" icon={<ArrowRight width={16} height={16} />}>
              {facultyHeading.cta.label}
            </GoldButton>
          </aside>

          {/* Faculty grid */}
          <div key={group ?? "all"} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((f, i) => (
              <Tilt key={f.name} max={6} className="rounded-sm">
              <article
                className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink/10 bg-paper [animation:rise-in_.6s_var(--ease-out-expo)_both]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-b from-deep to-ink">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(122,209,156,.45),transparent_60%)] opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
                  <Image
                    src={f.image}
                    alt={f.name}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="object-contain object-bottom transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[18px] font-semibold leading-tight">{f.name}</h3>
                  <p className="mt-1 text-[13.5px] text-byline-light">{f.title}</p>
                  <div className="mt-4 flex h-9 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.logo} alt={f.org} loading="lazy" className="h-full w-auto max-w-[150px] object-contain object-left" />
                  </div>
                  <hr className="my-4 border-ink/10" />
                  <span className="eyebrow text-deep">{f.interestLabel}</span>
                  <p className="mt-1.5 text-[14.5px] font-medium leading-snug">{f.interest}</p>
                </div>
              </article>
              </Tilt>
            ))}
          </div>
        </div>

        <Masterclasses />
      </div>
    </section>
  );
}

function Masterclasses() {
  const car = useCarousel<HTMLDivElement>();
  useDragScroll(car.ref);
  const head = useWordReveal<HTMLDivElement>();
  const spot = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={spot.ref}
      onPointerMove={spot.onPointerMove}
      onPointerLeave={spot.onPointerLeave}
      aria-label="Masterclasses"
      className="spotlight mt-[clamp(80px,8vw,128px)] grid gap-10 overflow-hidden rounded-sm bg-ink p-7 text-snow md:p-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
    >
      <div ref={head} className="flex flex-col justify-between gap-8">
        <div>
          <h2 className="section-title">
            <Words text={masterclasses.titleA} /> <Words text={masterclasses.titleB} className="accent text-mint" />
          </h2>
          <p data-fade className="mt-5 text-[15.5px] leading-[1.65] text-byline">
            {masterclasses.body}
          </p>
        </div>
        <div data-fade>
          <NavArrows name="masterclass" onPrev={car.prev} onNext={car.next} prevDisabled={car.edges.start} nextDisabled={car.edges.end} />
        </div>
      </div>
      <div ref={car.ref} className="no-scrollbar flex cursor-grab snap-x gap-4 overflow-x-auto active:cursor-grabbing">
        {masterclasses.items.map((m) => (
          <div key={m.title} data-card className="group relative aspect-[9/16] w-[62%] shrink-0 snap-start overflow-hidden rounded-sm bg-forest sm:w-[250px]">
            <Image src={m.image} alt={m.title} fill sizes="250px" draggable={false} className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </div>
  );
}
