"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { apply } from "@/data/content";
import { GoldButton, OutlineButton } from "@/components/ui/Button";
import { useWordReveal, Words } from "@/components/ui/Heading";
import Countdown from "@/components/ui/Countdown";
import { useSpotlight } from "@/lib/pointer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Apply() {
  const root = useRef<HTMLElement>(null);
  const copy = useWordReveal<HTMLDivElement>("top 75%");
  const spot = useSpotlight<HTMLDivElement>();

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-apply-img]",
        { scale: 1.2, yPercent: -6 },
        { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="scholarships" aria-label="Apply" className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)]">
      <div className="container-x">
        <div
          ref={spot.ref}
          onPointerMove={spot.onPointerMove}
          onPointerLeave={spot.onPointerLeave}
          className="spotlight grid overflow-hidden rounded-sm border border-snow/10 bg-gradient-to-br from-deep via-forest to-ink lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
        >
          <div ref={copy} className="relative flex flex-col justify-center p-8 md:p-14">
            <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-gold/15 blur-[90px]" />
            <h2 className="relative text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1.1] tracking-[-0.015em]">
              <Words text={apply.lines[0]} />
              <br />
              <Words text={apply.lines[1]} />
              <br />
              <Words text={apply.accent} className="accent text-gold" />
            </h2>
            <p data-fade className="relative mt-6 text-[17px] leading-[1.6] text-snow/85">
              Scholarships cover <strong className="text-snow">up to full tuition</strong>.
              <br />
              Round 1 closes <strong className="text-snow">15th Oct, 2026</strong>.
            </p>
            <div data-fade className="relative mt-8">
              <Countdown to={apply.deadline} label={apply.deadlineLabel} />
            </div>
            <div data-fade className="relative mt-9 flex flex-wrap gap-3">
              <GoldButton href={apply.primary.href} icon={false}>
                {apply.primary.label}
              </GoldButton>
              <OutlineButton href={apply.secondary.href}>{apply.secondary.label}</OutlineButton>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden lg:min-h-[560px]">
            <Image data-apply-img src={apply.image} alt={apply.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-forest/60 via-transparent to-transparent lg:from-forest" />
          </div>
        </div>
      </div>
    </section>
  );
}
