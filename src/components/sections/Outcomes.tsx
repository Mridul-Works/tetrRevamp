"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { chapters, outcomesHeading, type Chapter, type Company, type Story, type Startup, type Thumb } from "@/data/content";
import { useWordReveal, Words } from "@/components/ui/Heading";
import { Bold } from "@/components/ui/RichText";
import Counter from "@/components/ui/Counter";
import { NavArrows } from "@/components/ui/Button";
import { ArrowUpRight, Download } from "@/components/ui/icons";
import { PlayButton, usePlayVideo } from "@/components/ui/VideoModal";
import { useCarousel, useDragScroll } from "@/lib/hooks";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Outcomes() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const head = useWordReveal<HTMLDivElement>();
  const lenis = useLenis();

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      gsap.fromTo(
        "[data-stage-img]",
        { yPercent: -8, scale: 1.12 },
        { yPercent: 8, scale: 1.12, ease: "none", scrollTrigger: { trigger: "[data-stage]", start: "top bottom", end: "bottom top", scrub: true } },
      );
      // nav appears once the chapters begin
      ScrollTrigger.create({
        trigger: "[data-chapters]",
        start: "top 30%",
        end: "bottom 60%",
        toggleClass: { targets: "[data-chapter-nav]", className: "is-on" },
      });
    },
    { scope: root },
  );

  const goTo = (i: number) => {
    const el = root.current?.querySelectorAll<HTMLElement>("[data-chapter]")[i];
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -150 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={root} id="outcomes" aria-label="Business outcomes" className="relative bg-paper py-[clamp(96px,9vw,144px)] text-ink">
      <div className="container-x">
        {/* Heading */}
        <div ref={head} className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
          <h2 className="section-title max-w-[860px]">
            <Words text={outcomesHeading.line1} />
            <br />
            <Words text={outcomesHeading.line2a} className="accent" />
            <br />
            <Words text={outcomesHeading.line2b} className="accent" />
          </h2>
          <p data-fade className="max-w-[540px] text-[15.5px] leading-[1.65] text-byline-light">
            <Bold text={outcomesHeading.byline} strongClass="font-semibold text-ink" />
          </p>
        </div>

        {/* Stage */}
        <figure data-stage className="relative mt-14 overflow-hidden rounded-[24px] bg-ink">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              data-stage-img
              src={outcomesHeading.stage.image}
              alt={outcomesHeading.stage.alt}
              fill
              sizes="(min-width: 1400px) 1300px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          </div>
          <figcaption className="absolute inset-x-0 bottom-0">
            <dl className="grid grid-cols-3 divide-x divide-snow/15 border-t border-snow/15 bg-ink/40 backdrop-blur-md">
              {outcomesHeading.totals.map((t) => (
                <div key={t.label} className="flex flex-col-reverse gap-1 px-4 py-5 md:px-8 md:py-7">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-snow/70 md:text-[12px]">{t.label}</dt>
                  <dd className="text-[clamp(18px,3vw,44px)] font-semibold tracking-tight text-snow">
                    <Counter value={t.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </figcaption>
        </figure>

        {/* Floating chapter nav */}
        <nav
          data-chapter-nav
          aria-label="Chapters"
          className="pointer-events-none sticky top-20 z-30 mx-auto mt-10 w-fit max-w-full -translate-y-3 opacity-0 transition-all duration-500 [&.is-on]:pointer-events-auto [&.is-on]:translate-y-0 [&.is-on]:opacity-100"
        >
          <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-ink/10 bg-paper/85 p-1.5 shadow-[0_12px_40px_rgba(8,18,14,.12)] backdrop-blur-xl">
            {chapters.map((c, i) => (
              <button
                key={c.country}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => goTo(i)}
                className={cn(
                  "flex shrink-0 items-baseline gap-2 rounded-full px-4 py-2.5 transition-colors duration-300",
                  i === active ? "bg-deep text-snow" : "text-ink/70 hover:bg-ink/5",
                )}
              >
                <span className="text-[14px] font-semibold">{c.country}</span>
                <span className={cn("text-[10.5px] font-semibold uppercase tracking-[0.1em]", i === active ? "text-mint" : "text-ink/50")}>
                  {c.model}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div data-chapters className="mt-6">
          {chapters.map((c, i) => (
            <ChapterBlock key={c.country} c={c} last={i === chapters.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterLabel({ text }: { text: string }) {
  const [first, ...rest] = text.split(" · ");
  return (
    <p className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em]">
      <span className="flex items-center gap-2 text-gold">
        <span className="size-1.5 rounded-full bg-gold" />
        {first}
      </span>
      <span className="text-snow/60">{rest.join(" · ")}</span>
    </p>
  );
}

function ChapterBlock({ c, last }: { c: Chapter; last: boolean }) {
  const play = usePlayVideo();
  return (
    <div data-chapter className="pt-12">
      {/* Feature card */}
      <div className="grid overflow-hidden rounded-[24px] bg-ink text-snow lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="relative flex flex-col p-7 md:p-11">
          <ChapterLabel text={c.chapter} />
          <p className="mt-6 text-[clamp(26px,2.6vw,38px)] font-semibold leading-[1.15] tracking-tight">{c.title}</p>
          <p className="mt-5 text-[15px] leading-[1.7] text-byline">{c.body}</p>
          {c.metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-snow/10 pt-7">
              {c.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-[clamp(20px,2.2vw,32px)] font-semibold tracking-tight text-mint">
                    <Counter value={m.value} />
                  </p>
                  <p className="mt-1 text-[11.5px] uppercase leading-snug tracking-[0.1em] text-snow/60">{m.label}</p>
                </div>
              ))}
            </div>
          )}
          {c.report && (
            <a
              href={c.report.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-fit items-center gap-2 border-b border-gold pb-1 text-[13.5px] font-semibold text-gold transition-colors hover:text-snow"
            >
              <Download width={16} height={16} /> {c.report.label}
            </a>
          )}
        </div>
        <Ventures c={c} onPlay={(name, yt) => play({ title: name, youtube: yt })} />
      </div>

      {/* Who backs you + showcase */}
      {c.showcase.kind === "stories" ? (
        <Stories stories={c.showcase.stories} heading={c.partB.line1} />
      ) : (
        <>
          <div className="mt-12 max-w-[760px]">
            <h4 className="text-[clamp(22px,2vw,28px)] font-semibold tracking-tight">{c.partB.line1}</h4>
            {c.partB.line2 && <p className="mt-3 text-[17px] text-ink/85">{c.partB.line2}</p>}
            {c.partB.line3 && <p className="mt-2 text-[15px] leading-[1.65] text-byline-light">{c.partB.line3}</p>}
          </div>
          <div className="mt-8">
            {c.showcase.kind === "companies" && <Companies list={c.showcase.companies} />}
            {c.showcase.kind === "thumbnails" && <Thumbs list={c.showcase.thumbnails} />}
            {c.showcase.kind === "startups" && <Startups list={c.showcase.startups} />}
          </div>
        </>
      )}

      {!last && (
        <div aria-hidden className="mt-16 flex items-center gap-3">
          <span className="size-1.5 bg-ink/40" />
          <span className="h-px flex-1 border-t border-dashed border-ink/25" />
          <span className="size-2 bg-ink" />
          <span className="h-px flex-1 border-t border-dashed border-ink/25" />
          <span className="size-1.5 bg-ink/40" />
        </div>
      )}
    </div>
  );
}

function Ventures({ c, onPlay }: { c: Chapter; onPlay: (name: string, yt?: string) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  useDragScroll(rail);
  const solo = c.ventures.length === 1;

  if (solo) {
    const v = c.ventures[0];
    return (
      <div className="relative min-h-[280px] overflow-hidden bg-forest">
        <Image src={v.image} alt={`${v.name} venture`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        {!v.static && v.youtube && (
          <PlayButton label={`Play ${v.name} video`} onClick={() => onPlay(v.name, v.youtube)} className="absolute right-5 top-5" size={60} />
        )}
      </div>
    );
  }

  return (
    <div ref={rail} className="no-scrollbar flex cursor-grab gap-3 overflow-x-auto bg-forest p-4 active:cursor-grabbing md:p-6" aria-label={`${c.country} venture videos`}>
      {c.ventures.map((v) => (
        <div key={v.name} className="group relative aspect-[9/16] w-[220px] shrink-0 overflow-hidden rounded-xl bg-slab md:w-[240px]">
          <Image src={v.image} alt={`${v.name} venture`} fill sizes="240px" draggable={false} className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}

function Companies({ list }: { list: Company[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
      {list.map((co, i) => {
        const card = (
          <>
            <div className="relative aspect-square overflow-hidden bg-cream">
              <Image src={co.image} alt={co.name} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              {co.description && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/95 via-ink/70 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <p className="text-[12.5px] leading-[1.5] text-snow/90">{co.description}</p>
                </div>
              )}
              {co.href && (
                <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-ink/80 text-snow transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight width={14} height={14} />
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gold">{co.cohort}</p>
              <h4 className="mt-1.5 text-[16px] font-semibold">{co.name}</h4>
              <dl className="mt-auto grid grid-cols-2 gap-2 border-t border-snow/12 pt-3.5">
                {co.figures.slice(0, 2).map((f, n) => (
                  <div key={f.label} className={cn("flex min-w-0 flex-col-reverse", n === 1 && "border-l border-snow/12 pl-3")}>
                    <dt className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-snow/55">{f.label}</dt>
                    <dd className="text-[16px] font-semibold tracking-tight md:text-[18px]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        );
        const cls =
          "group flex h-full flex-col overflow-hidden rounded-[10px] bg-ink text-snow shadow-[0_18px_40px_rgba(8,18,14,.12)] transition-transform duration-500 hover:-translate-y-1.5";
        return (
          <li key={co.name} className="[animation:rise-in_.7s_var(--ease-out-expo)_both]" style={{ animationDelay: `${i * 70}ms` }}>
            {co.href ? (
              <a href={co.href} target="_blank" rel="noreferrer" aria-label={`${co.name} (opens in a new tab)`} className={cls}>
                {card}
              </a>
            ) : (
              <article className={cls}>{card}</article>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Thumbs({ list }: { list: Thumb[] }) {
  const play = usePlayVideo();
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {list.map((t) => (
        <li
          key={t.name}
          className={cn("group relative aspect-[9/16] overflow-hidden rounded-[10px] bg-deep", t.video && "cursor-pointer")}
          onClick={() => t.video && play({ title: t.name, mp4: t.video })}
        >
          <Image src={t.image} alt={`${t.name} video thumbnail`} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          {t.video && <PlayButton label={`Play the ${t.name} video`} onClick={() => play({ title: t.name, mp4: t.video })} className="absolute right-3 top-3" size={44} />}
        </li>
      ))}
    </ul>
  );
}

function Stories({ stories, heading }: { stories: Story[]; heading: string }) {
  const car = useCarousel<HTMLUListElement>();
  useDragScroll(car.ref);
  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h4 className="text-[clamp(22px,2vw,28px)] font-semibold tracking-tight">{heading}</h4>
        <NavArrows name="impact story" tone="light" onPrev={car.prev} onNext={car.next} prevDisabled={car.edges.start} nextDisabled={car.edges.end} />
      </div>
      <ul ref={car.ref} className="no-scrollbar mt-8 flex cursor-grab snap-x gap-4 overflow-x-auto pb-2 active:cursor-grabbing" aria-label="Ghana impact stories">
        {stories.map((s) => (
          <li key={s.name} data-card className="w-[82%] shrink-0 snap-start sm:w-[380px]">
            <article className="group h-full overflow-hidden rounded-[14px] border border-ink/10 bg-snow">
              <div className="relative aspect-[19/10] overflow-hidden bg-cream">
                <Image src={s.image} alt={`${s.name} team`} fill sizes="380px" draggable={false} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-snow/90 px-2.5 py-0.5 font-mono text-[11px]">{s.index}</span>
              </div>
              <div className="p-5">
                <h5 className="text-[18px] font-semibold">{s.name}</h5>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-[28px] font-semibold tracking-tight text-deep">
                    <Counter value={s.figure.value} />
                  </p>
                  <p className="text-[12px] uppercase tracking-[0.1em] text-byline-light">{s.figure.label}</p>
                </div>
                <p className="mt-2 text-[14px] leading-[1.6] text-byline-light">{s.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Startups({ list }: { list: Startup[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((s, i) => (
        <li
          key={s.name}
          className="group relative overflow-hidden rounded-[14px] border border-ink/10 bg-snow p-6 transition-colors duration-500 hover:border-deep"
        >
          <span className="pointer-events-none absolute -right-3 -top-6 font-serif text-[110px] italic leading-none text-ink/[0.05] transition-colors duration-500 group-hover:text-mint/20">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex h-10 items-center justify-between">
            <span className="font-mono text-[12px] text-byline-light">{String(i + 1).padStart(2, "0")}</span>
            {s.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.logo}
                alt={`${s.name} logo`}
                loading="lazy"
                className={cn("h-9 w-auto max-w-[110px] object-contain", s.logoBare && "rounded-md bg-ink px-1.5 py-1")}
              />
            )}
          </div>
          <h5 className="mt-8 text-[22px] font-semibold">{s.name}</h5>
          <p className="mt-2 text-[14px] leading-[1.6] text-byline-light">{s.description}</p>
        </li>
      ))}
    </ul>
  );
}
