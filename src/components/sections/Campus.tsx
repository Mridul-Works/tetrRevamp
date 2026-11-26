"use client";

import { useState } from "react";
import Image from "next/image";
import { campusCities, campusHeading, campusPhoto, campusViews } from "@/data/content";
import Heading from "@/components/ui/Heading";
import { cn } from "@/lib/cn";

export default function Campus() {
  const [city, setCity] = useState(0);
  const [view, setView] = useState(0);
  const c = campusCities[city];
  const views = campusViews.map((v) => ({ ...v, src: campusPhoto(c.slug, v.slug) }));
  const current = views[view]?.src ? views[view] : views.find((v) => v.src)!;

  return (
    <section id="campus" aria-label="Campus and living" className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)]">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative">
        <Heading breakLine {...campusHeading} />

        <div className="mt-14 overflow-hidden rounded-[24px] border border-snow/10 bg-forest/70">
          <div role="tablist" aria-label="Cities" className="no-scrollbar flex overflow-x-auto border-b border-snow/10">
            {campusCities.map((ct, i) => (
              <button
                key={ct.slug}
                type="button"
                role="tab"
                aria-selected={i === city}
                onClick={() => {
                  setCity(i);
                  setView(0);
                }}
                className={cn(
                  "relative min-w-[130px] flex-1 px-4 py-5 text-[12.5px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  i === city ? "bg-gradient-to-b from-mint/20 to-mint/0 text-snow" : "text-snow/60 hover:bg-mint/10 hover:text-snow",
                )}
              >
                {i === city && <span className="absolute inset-x-0 top-0 h-[2px] bg-mint" />}
                {ct.name}
              </button>
            ))}
          </div>

          <div className="grid gap-5 p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-ink">
              {current?.src && (
                <Image
                  key={current.src}
                  src={current.src}
                  alt={`${c.name} ${current.label}`}
                  fill
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="object-cover [animation:settle_1.6s_var(--ease-out-expo)_both,fade-in_.6s_ease_both]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-[clamp(28px,3vw,44px)] font-semibold leading-none tracking-tight">{c.name}</p>
                <p className="mt-2 flex items-center gap-2 text-[13px] uppercase tracking-[0.14em] text-mint">
                  <span className="size-1.5 rounded-full bg-mint" /> {current?.label}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-byline">Choose a View</p>
                <p className="text-[13px] font-semibold text-mint">{current?.label}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
                {views.map((v, n) => (
                  <button
                    key={v.slug}
                    type="button"
                    disabled={!v.src}
                    aria-pressed={current?.slug === v.slug}
                    onClick={() => setView(n)}
                    className={cn(
                      "group relative h-[92px] overflow-hidden rounded-xl border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                      current?.slug === v.slug ? "border-mint" : "border-snow/15 hover:border-snow/50",
                    )}
                  >
                    {v.src && <Image src={v.src} alt="" fill sizes="170px" className="object-cover transition-transform duration-500 group-hover:scale-110" />}
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/85 to-ink/10" />
                    <span className="absolute bottom-2 left-3 text-[12.5px] font-semibold">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
