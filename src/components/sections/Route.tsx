"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { countries, partnerLogos, routeHeading, routeTabs } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Marquee from "@/components/ui/Marquee";
import { Star } from "@/components/ui/icons";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const RouteGlobe = dynamic(() => import("@/components/three/RouteGlobe"), { ssr: false });

const points = countries.map((c) => c.coords);
const labels = countries.map((c) => c.name);

export default function Route() {
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<(typeof routeTabs)[number]["key"]>("business");
  const c = countries[active];
  const items = c[tab];
  const { ref, inView } = useInView<HTMLDivElement>();

  const select = (i: number) => {
    setActive(i);
    setTab("business");
  };

  return (
    <section id="route" aria-label="The route" className="relative overflow-hidden bg-forest py-[clamp(96px,9vw,144px)]">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-mint/10 blur-[120px]" />
      <div className="container-x relative">
        <Heading breakLine {...routeHeading} />

        <Timeline active={active} onSelect={select} />

        <div className="mt-8 grid overflow-hidden rounded-sm border border-snow/10 bg-ink/50 backdrop-blur-sm lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Globe + photo card */}
          <div ref={ref} className="relative min-h-[520px] overflow-hidden border-b border-snow/10 bg-[radial-gradient(ellipse_at_50%_60%,rgba(30,77,51,.55),rgba(8,18,14,0)_62%)] lg:min-h-[760px] lg:border-b-0 lg:border-r">
            <div className="absolute inset-0">
              <RouteGlobe points={points} labels={labels} active={active} onSelect={select} running={inView} />
            </div>
            <PhotoCard key={c.name} photos={c.photos} name={c.name} />
            {/* term badge */}
            <div key={`badge-${c.name}`} className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 [animation:rise-in_.6s_var(--ease-out-expo)_both]">
              <span className="grid size-11 place-items-center rounded-sm bg-gold font-mono text-[15px] font-bold text-gold-ink shadow-[0_0_0_4px_rgba(242,201,76,.2)]">
                {String(c.term).padStart(2, "0")}
              </span>
              <span className="leading-tight">
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-mint">Term {c.term} · now landing</span>
                <span className="block text-[15px] font-semibold text-snow">{c.name}</span>
              </span>
            </div>
            <p className="eyebrow pointer-events-none absolute right-5 top-5 text-snow/50">
              {String(active + 1).padStart(2, "0")} / {String(countries.length).padStart(2, "0")}
            </p>
          </div>

          {/* Details */}
          <div key={c.name} className="flex flex-col p-6 [animation:rise-in_.7s_var(--ease-out-expo)_both] md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-[clamp(36px,4vw,56px)] font-semibold leading-none tracking-tight">{c.name}</h3>
              <div className="flex flex-wrap gap-2">
                {c.chips.map((chip) => (
                  <span key={chip} className="rounded-sm border border-snow/20 px-3 py-1 text-[12.5px] text-snow/85">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-5 text-[15.5px] leading-[1.65] text-byline">{c.pitch}</p>

            <div role="tablist" aria-label={`${c.name} learning`} className="mt-7 flex gap-6 overflow-x-auto border-b border-snow/10 no-scrollbar">
              {routeTabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "-mb-px whitespace-nowrap border-b-2 pb-3 text-[11.5px] font-medium uppercase tracking-[0.1em] transition-colors",
                    tab === t.key ? "border-gold text-gold" : "border-transparent text-gold/55 hover:text-gold",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <ul key={tab} className="mt-3 grid">
              {items.length === 0 ? (
                <li className="py-3 text-[14px] text-byline">Details for {c.name} are being finalised.</li>
              ) : (
                items.map((it, i) => (
                  <li
                    key={it.title}
                    className="group -mx-3 rounded-sm px-3 py-2.5 transition-colors [animation:rise-in_.5s_var(--ease-out-expo)_both] hover:bg-snow/[0.04]"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <p className="text-[14.5px] leading-[1.5]">
                      <span className="font-semibold text-snow transition-colors group-hover:text-mint">{it.title}</span>
                      <span className="text-byline"> — {it.description}</span>
                    </p>
                  </li>
                ))
              )}
            </ul>

            <div className="relative mt-6 overflow-hidden rounded-sm border border-mint/25 bg-mint/[0.07] py-4 pl-5 pr-4">
              <span className="absolute inset-y-0 left-0 w-[3px] bg-mint" />
              <p className="eyebrow flex items-center gap-2 text-mint">
                <Star width={15} height={15} /> What You&apos;ll Build
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.55] text-snow/90">{c.build}</p>
            </div>

            <div className="mt-auto pt-7">
              <p className="eyebrow mb-3 text-byline">Partners</p>
              <Marquee duration={c.partners.length * 6}>
                {[...c.partners, ...c.partners].map((p, i) => (
                  <PartnerMark key={`${p}-${i}`} name={p} />
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerMark({ name }: { name: string }) {
  const logo = partnerLogos[name];
  return (
    <span className="mx-7 inline-flex h-10 items-center">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.src}
          alt={`${name} logo`}
          style={{ height: logo.h, width: Math.round(logo.h * logo.aspect) }}
          className="wordmark-white opacity-75 transition-opacity hover:opacity-100"
          loading="lazy"
        />
      ) : (
        <span className="whitespace-nowrap text-[15px] font-medium tracking-tight text-snow/75">{name}</span>
      )}
    </span>
  );
}

function Timeline({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [geo, setGeo] = useState<{ start: number; end: number; fill: number } | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const mid = (b: HTMLButtonElement | null) => (b ? b.offsetLeft + b.offsetWidth / 2 : 0);
    const measure = () =>
      setGeo({ start: mid(btns.current[0]), end: mid(btns.current[countries.length - 1]), fill: mid(btns.current[active]) });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => {
    const el = wrap.current;
    const b = btns.current[active];
    if (!el || !b || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: b.offsetLeft - (el.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div ref={wrap} className="no-scrollbar mt-14 overflow-x-auto">
      <div role="tablist" aria-label="Countries on the route" className="relative flex min-w-max justify-between gap-6 px-2 pb-2">
        {geo && (
          <>
            <span aria-hidden className="absolute top-[7px] h-px bg-snow/15" style={{ left: geo.start, width: geo.end - geo.start }} />
            <span
              aria-hidden
              className="absolute top-[7px] h-px bg-gradient-to-r from-mint to-gold transition-[width] duration-700 ease-out-expo"
              style={{ left: geo.start, width: geo.fill - geo.start }}
            />
          </>
        )}
        {countries.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.name}
              ref={(el) => {
                btns.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onSelect(i)}
              className="group relative flex min-w-[88px] flex-col items-center gap-3"
            >
              <span
                className={cn(
                  "relative grid size-[15px] place-items-center rounded-full border transition-all duration-500",
                  on ? "border-gold bg-gold" : i < active ? "border-mint bg-mint" : "border-snow/30 bg-forest group-hover:border-gold",
                )}
              >
                {on && <span className="absolute inset-0 rounded-full bg-gold [animation:ping-slow_1.8s_ease-out_infinite]" />}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[15px] uppercase tracking-[0.08em] transition-colors duration-300 sm:text-[17px]",
                  on ? "font-semibold text-gold" : "font-medium text-gold/60 group-hover:text-gold",
                )}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhotoCard({ photos, name }: { photos: string[]; name: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % photos.length), 4000);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <div className="absolute bottom-5 left-5 z-10 w-[min(42%,250px)] overflow-hidden rounded-sm border border-snow/15 bg-ink shadow-[0_30px_60px_rgba(0,0,0,.5)] [animation:rise-in_.8s_var(--ease-out-expo)_both]">
      <div className="relative aspect-[4/3]">
        {photos.map((src, n) => (
          <Image
            key={src}
            src={src}
            alt={`${name} photo`}
            fill
            sizes="320px"
            className={cn("object-cover transition-opacity duration-1000", n === i ? "opacity-100" : "opacity-0")}
          />
        ))}
        <span className="absolute left-3 top-3 rounded-sm bg-ink/70 px-2.5 py-1 text-[12px] font-semibold backdrop-blur">{name}</span>
      </div>
      <div className="flex justify-center gap-1.5 py-2.5">
        {photos.map((src, n) => (
          <button
            key={src}
            type="button"
            aria-label={`Show photo ${n + 1}`}
            onClick={() => setI(n)}
            className={cn("h-1.5 transition-all", n === i ? "w-6 bg-snow" : "w-1.5 bg-snow/40")}
          />
        ))}
      </div>
    </div>
  );
}
