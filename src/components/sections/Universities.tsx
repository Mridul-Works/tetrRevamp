"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { countries, onboardTicket, universities, universitiesHeading } from "@/data/content";
import { useWordReveal, Words } from "@/components/ui/Heading";
import { Bold } from "@/components/ui/RichText";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Tile geometry [x, y, w, h] on a 1440×892 stage, in the same order as `universities`.
 * The stage is scaled as one piece (see .uni-collage in globals.css), so the ring of
 * photos keeps its spacing around the centred heading on any screen shape.
 */
const STAGE: [number, number, number, number][] = [
  [100, 70, 420, 236], // Cornell, top left
  [880, 40, 300, 169], // UBI, top right of centre
  [1130, 250, 290, 163], // FITT, right
  [-20, 400, 330, 186], // Illinois, left
  [1080, 580, 360, 203], // INSEAD, bottom right
  [340, 660, 380, 214], // Adelphi, bottom left of centre
];

export default function Universities() {
  const stage = useRef<HTMLDivElement>(null);
  const copy = useWordReveal<HTMLDivElement>("top 85%");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: one pinned scene — the collage assembles, gives way to a boarding pass, and the pass
      // zooms until the screen is paper-white, handing over to the (paper) Outcomes section below.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = stage.current!;
        const tiles = gsap.utils.toArray<HTMLElement>("[data-uni-tile]", el);
        const ticket = el.querySelector<HTMLElement>("[data-ticket]")!;
        const paper = getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim() || "#f6f8f4";
        // offset from a tile's resting centre to the stage centre (layout box, ignores transforms)
        const dx = (t: HTMLElement) => el.clientWidth / 2 - (t.offsetLeft + t.offsetWidth / 2);
        const dy = (t: HTMLElement) => el.clientHeight / 2 - (t.offsetTop + t.offsetHeight / 2);
        // scale at which the pass covers the whole screen, corners included
        const cover = () => Math.max(el.clientWidth / ticket.offsetWidth, el.clientHeight / ticket.offsetHeight) * 1.3;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=360%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });

        // 1 · photos fly out from the centre into a ring around the heading
        tl.fromTo("[data-uni-ctr]", { autoAlpha: 0, y: 40, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" }, 0.03);
        tiles.forEach((t, i) => {
          tl.fromTo(
            t,
            { x: () => dx(t), y: () => dy(t), scale: 0, autoAlpha: 0 },
            { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.46, ease: "power3.out" },
            i * 0.06,
          );
        });

        // 2 · (after a short hold) the collage clears outward and the boarding pass slides up
        tiles.forEach((t) => {
          tl.to(t, { x: () => -dx(t) * 0.9, y: () => -dy(t) * 0.9, scale: 1.2, autoAlpha: 0, duration: 0.22, ease: "power2.in" }, 0.88);
        });
        tl.to("[data-uni-ctr]", { autoAlpha: 0, y: -50, scale: 0.96, duration: 0.14, ease: "power2.in" }, 0.9);
        tl.fromTo(
          ticket,
          { autoAlpha: 0, yPercent: 70, rotate: -9, scale: 0.88 },
          { autoAlpha: 1, yPercent: 0, rotate: -2.5, scale: 1, duration: 0.22, ease: "power3.out" },
          1.0,
        );
        tl.fromTo("[data-ticket-stamp]", { autoAlpha: 0, scale: 2.2, rotate: -40 }, { autoAlpha: 1, scale: 1, rotate: -14, duration: 0.07, ease: "power4.out" }, 1.2);

        // 3 · the pass holds on screen (1.27 → 1.45), then zooms until it fills the screen
        tl.to("[data-ticket-fade], [data-ticket-stamp]", { autoAlpha: 0, duration: 0.1 }, 1.45);
        tl.to(ticket, { rotate: 0, scale: cover, duration: 0.3, ease: "power2.in" }, 1.45);
        // the stage and the (ink) section behind it both turn paper, so no dark seam can show
        // at the junction with the paper Outcomes section while the pin releases
        tl.to([el, el.closest("section")], { backgroundColor: paper, duration: 0.03 }, 1.72);
        tl.to({}, { duration: 0.06 }); // a beat of plain white before the pin lets go
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  return (
    <div className="mt-[clamp(80px,8vw,128px)]">
      <div ref={stage} aria-label="Partner universities" className="uni-collage">
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[60%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/[0.05] blur-[110px] lg:block" />

        <div className="uni-ctr-wrap">
          <div data-uni-ctr ref={copy} className="uni-ctr text-center">
            <h2 className="section-title text-snow">
              <Words text={universitiesHeading.line1} />{" "}
              <Words text={universitiesHeading.line2} className="accent text-snow" />
            </h2>
            <p data-fade className="mx-auto mt-5 max-w-[560px] text-[15.5px] leading-[1.65] text-byline">
              <Bold text={universitiesHeading.byline} strongClass="font-semibold text-snow" />
            </p>
          </div>
        </div>

        {universities.map((u, i) => {
          const [x, y, w, h] = STAGE[i % STAGE.length];
          return (
            <article
              key={u.name}
              data-uni-tile
              className="uni-tile group overflow-hidden rounded-sm bg-forest will-change-transform"
              style={{ "--x": x, "--y": y, "--w": w, "--h": h } as React.CSSProperties}
            >
              <Image
                src={u.photo}
                alt={`${u.name} campus`}
                fill
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="object-cover saturate-[1.1] transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
              />
              {/* soft scrim centred behind the logo keeps it legible without dimming the whole photo */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_center,rgb(8_18_14/0.5),rgb(8_18_14/0.12)_75%,rgb(8_18_14/0.05))] transition-opacity duration-700 group-hover:opacity-70" />
              <div className="absolute inset-0 rounded-sm ring-1 ring-inset ring-snow/10" />
              <div className="absolute inset-0 grid place-items-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.logo}
                  alt={u.name}
                  loading="lazy"
                  style={{ "--lh": u.logoH } as React.CSSProperties}
                  className={cn(
                    "uni-logo w-auto max-w-[75%] object-contain transition-transform duration-500 group-hover:scale-105",
                    u.nativeColor && "box-content rounded-sm bg-snow px-3 py-2",
                  )}
                />
              </div>
            </article>
          );
        })}

        <BoardingPass />
      </div>
    </div>
  );
}

/** Bar widths for the stub's decorative barcode. */
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 4, 1, 1, 2, 1, 3, 2, 1, 1, 1, 3, 1, 2, 2, 1, 4, 1, 1, 2, 1, 3, 1, 1, 2];

/** The boarding pass that closes the collage scene (desktop + motion only; see .uni-ticket-wrap). */
function BoardingPass() {
  const t = onboardTicket;
  return (
    <div className="uni-ticket-wrap" aria-hidden="true">
      <div
        data-ticket
        className="uni-ticket relative flex w-[min(920px,70vw)] rounded-sm bg-paper text-ink shadow-[0_40px_120px_rgba(0,0,0,.55)]"
        style={{ "--stub": "clamp(180px,17vw,236px)" } as React.CSSProperties}
      >
        {/* main part */}
        <div data-ticket-fade className="flex min-w-0 flex-1 flex-col p-[clamp(26px,2.6vw,40px)]">
          <div className="flex items-center justify-between gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/tetr/logo-header.png" alt="" className="h-[clamp(30px,2.6vw,38px)] w-auto" />
            <span className="eyebrow text-deep">{t.eyebrow}</span>
          </div>

          <p className="mt-[clamp(18px,2vw,28px)] text-[clamp(34px,3.8vw,58px)] font-semibold leading-[1.05] tracking-tight">
            {t.title} <span className="accent text-deep">{t.titleAccent}</span>
          </p>

          <div className="mt-[clamp(18px,2vw,28px)] flex items-end gap-5">
            <div>
              <div className="font-mono text-[clamp(26px,2.4vw,38px)] font-semibold leading-none">{t.from.code}</div>
              <div className="mt-1.5 text-[13px] text-byline-light">{t.from.city}</div>
            </div>
            <div className="relative mb-[26px] flex-1 border-t-2 border-dashed border-ink/20">
              <svg viewBox="0 0 24 24" className="absolute left-1/2 top-0 size-6 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-paper px-0.5 text-deep" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="font-mono text-[clamp(26px,2.4vw,38px)] font-semibold leading-none">{t.to.code}</div>
              <div className="mt-1.5 text-[13px] text-byline-light">{t.to.city}</div>
            </div>
          </div>
          <p className="mt-3 truncate font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink/45">
            {countries.map((c) => c.name).join("  ·  ")}
          </p>

          <dl className="mt-[clamp(18px,2vw,26px)] grid grid-cols-4 gap-4 border-t border-ink/10 pt-5">
            {t.fields.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/45">{f.label}</dt>
                <dd className="mt-1 text-[15px] font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* perforation + punched notches */}
        <div data-ticket-fade className="my-7 border-l-2 border-dashed border-ink/15" />
        <span data-ticket-fade className="absolute right-[var(--stub)] top-0 size-9 -translate-y-1/2 translate-x-1/2 rounded-full bg-ink" />
        <span data-ticket-fade className="absolute bottom-0 right-[var(--stub)] size-9 translate-x-1/2 translate-y-1/2 rounded-full bg-ink" />

        {/* stub */}
        <div data-ticket-fade className="flex w-[var(--stub)] shrink-0 flex-col justify-between p-[clamp(22px,2.2vw,32px)]">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/45">Flight</div>
            <div className="mt-1 font-mono text-[20px] font-semibold">{t.stub.flight}</div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-sm bg-deep px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-snow">
            <span className="size-1.5 rounded-full bg-mint" />
            {t.stub.status}
          </div>
          <div className="flex h-14 items-stretch gap-[2px]">
            {BARS.map((w, i) => (
              <span key={i} className="bg-ink" style={{ width: w * 1.5 }} />
            ))}
          </div>
        </div>

        {/* stamp */}
        <div
          data-ticket-stamp
          className="pointer-events-none absolute right-[calc(var(--stub)+clamp(90px,8vw,118px))] top-[20%] grid size-[clamp(92px,7.6vw,110px)] place-items-center rounded-full border-[3px] border-deep/80 text-center text-deep/85 mix-blend-multiply"
        >
          <span className="absolute inset-[7px] rounded-full border border-dashed border-deep/60" />
          <span className="font-mono text-[clamp(12px,1vw,15px)] font-bold uppercase tracking-[0.16em]">{t.stamp}</span>
        </div>
      </div>
    </div>
  );
}
