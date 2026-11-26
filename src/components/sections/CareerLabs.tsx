"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { careerLabs } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Counter from "@/components/ui/Counter";
import Marquee from "@/components/ui/Marquee";
import { GoldButton } from "@/components/ui/Button";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tile =
  | { kind: "intern"; company: string; founder: string; photo: string }
  | { kind: "stat"; value: string; label: string; tone: "deep" | "paper" | "mid" | "dark" }
  | { kind: "cta" };

// Same interleave as the reference: a stat tile after every second intern, CTA last.
const tiles: Tile[] = (() => {
  const out: Tile[] = [];
  let s = 0;
  careerLabs.interns.forEach((t, i) => {
    out.push({ kind: "intern", ...t });
    if (i % 2 === 1 && s < careerLabs.tiles.length) out.push({ kind: "stat", ...careerLabs.tiles[s++] });
  });
  while (s < careerLabs.tiles.length) out.push({ kind: "stat", ...careerLabs.tiles[s++] });
  out.push({ kind: "cta" });
  return out;
})();

const ratios = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[3/4]"];
const tones = { deep: "bg-deep text-snow", mid: "bg-slab text-snow", dark: "bg-panel text-snow border border-snow/10", paper: "bg-cream text-ink" };

function TileCard({ t, ratio }: { t: Tile; ratio: string }) {
  if (t.kind === "intern")
    return (
      <article className={cn("group relative overflow-hidden rounded-2xl", ratio)}>
        <Image
          src={t.photo}
          alt={`${t.founder} — intern at ${t.company}`}
          fill
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </article>
    );
  if (t.kind === "stat")
    return (
      <article className={cn("flex flex-col justify-between rounded-2xl p-4 sm:p-6", ratio, tones[t.tone])}>
        <div>
          <p className="text-[clamp(30px,3.4vw,52px)] font-semibold leading-none tracking-tight">
            <Counter value={t.value} />
          </p>
          <p className="mt-3 text-[clamp(13px,1.2vw,17px)] leading-snug opacity-90">{t.label}</p>
        </div>
        <span className={cn("hidden text-[11px] uppercase tracking-[0.18em] sm:block", t.tone === "paper" ? "text-ink/50" : "text-snow/60")}>
          Tetr
        </span>
      </article>
    );
  return (
    <a
      href={careerLabs.cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group flex flex-col justify-between rounded-2xl bg-mint p-4 text-ink transition-transform duration-500 hover:scale-[1.02] sm:p-6", ratio)}
    >
      <div>
        <p className="text-[clamp(24px,2.4vw,34px)] font-semibold leading-none">{careerLabs.cta.headline}</p>
        <p className="mt-3 text-[14px] leading-snug">{careerLabs.cta.body}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">{careerLabs.cta.label}</span>
        <span className="grid size-10 place-items-center rounded-full bg-ink text-mint transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight width={16} height={16} />
        </span>
      </div>
    </a>
  );
}

export default function CareerLabs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // masonry columns drift at different speeds
      gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col, i) => {
        gsap.fromTo(
          col,
          { y: i % 2 ? 80 : 0 },
          { y: i % 2 ? -40 : 40, ease: "none", scrollTrigger: { trigger: "[data-masonry]", start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      gsap.from("[data-tile]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: "[data-masonry]", start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const columns: { t: Tile; i: number }[][] = [[], [], [], [], []];
  tiles.forEach((t, i) => columns[i % 5].push({ t, i }));

  return (
    <section ref={root} id="career-labs" aria-label="Career Labs" className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)]">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
      <div className="container-x relative">
        <Heading eyebrow={careerLabs.eyebrow} line1={careerLabs.line1} line2={careerLabs.line2} byline={careerLabs.byline} />

        {/* Map panel */}
        <div className="mt-14 overflow-hidden rounded-[24px] border border-snow/10 bg-forest/70">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-snow/10 p-6 md:p-8">
            <h3 className="text-[clamp(22px,2vw,28px)] font-semibold">{careerLabs.mapTitle}</h3>
            <GoldButton href={careerLabs.report.href} icon={<ArrowRight width={16} height={16} />}>
              {careerLabs.report.label}
            </GoldButton>
          </div>
          <dl className="grid grid-cols-2 border-b border-snow/10 lg:grid-cols-4">
            {careerLabs.stats.map((s, i) => (
              <div key={s.label} className={cn("flex flex-col gap-2 p-6 md:p-8", i % 2 === 1 && "border-l border-snow/10", i >= 2 && "border-t border-snow/10 lg:border-t-0", i === 2 && "lg:border-l")}>
                <dt className="text-[clamp(32px,3.4vw,52px)] font-semibold leading-none tracking-tight text-mint">
                  <Counter value={s.value} />
                </dt>
                <dd className="text-[14px] leading-snug text-byline">{s.text}</dd>
              </div>
            ))}
          </dl>
          <div className="relative aspect-[16/8]">
            <Image src={careerLabs.map.src} alt={careerLabs.map.alt} fill sizes="(min-width: 1400px) 1300px, 100vw" className="object-cover" />
          </div>
        </div>

        {/* Masonry */}
        <div data-masonry className="mt-14">
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {tiles.map((t, i) => (
              <div key={i} data-tile>
                <TileCard t={t} ratio={ratios[i % ratios.length]} />
              </div>
            ))}
          </div>
          <div className="hidden grid-cols-5 gap-4 md:grid">
            {columns.map((col, c) => (
              <div key={c} data-col className="flex flex-col gap-4">
                {col.map(({ t, i }) => (
                  <div key={i} data-tile>
                    <TileCard t={t} ratio={ratios[(i + c) % ratios.length]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Recruiters */}
        <div className="mt-20 border-t border-snow/10 pt-10">
          <p className="eyebrow mb-6 text-byline">{careerLabs.recruitersLabel}</p>
          <Marquee duration={36}>
            {careerLabs.recruiters.map((r) => (
              <span key={r.name} className="mx-10 inline-flex h-12 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.src}
                  alt={`${r.name} logo`}
                  loading="lazy"
                  style={{ height: r.h * 1.15, width: Math.round(r.h * 1.15 * r.aspect) }}
                  className="wordmark-white opacity-70 transition-opacity hover:opacity-100"
                />
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
