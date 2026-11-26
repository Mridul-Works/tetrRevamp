"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { launchpad } from "@/data/content";
import { GoldButton } from "@/components/ui/Button";
import { useWordReveal, Words } from "@/components/ui/Heading";
import { ArrowRight } from "@/components/ui/icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Launchpad() {
  const root = useRef<HTMLElement>(null);
  const copy = useWordReveal<HTMLDivElement>("top 75%");

  useGSAP(
    () => {
      // photo opens from a slit into a wide frame
      gsap.fromTo(
        "[data-lp-frame]",
        { clipPath: "inset(18% 22% 18% 22% round 4px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 4px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-lp-img]",
        { scale: 1.25 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="launchpad" aria-label="Launchpad" className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)]">
      <div className="container-x">
        <div data-lp-frame className="relative overflow-hidden rounded-sm">
          <div className="relative min-h-[640px] md:min-h-[720px]">
            <Image data-lp-img src={launchpad.image} alt={launchpad.imageAlt} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="grain absolute inset-0" />
          </div>

          <div ref={copy} className="absolute inset-0 flex items-end p-7 md:items-center md:p-16">
            <div className="max-w-[640px]">
              <p data-fade className="eyebrow flex items-center gap-3 text-gold">
                <span className="h-px w-8 bg-gold" />
                {launchpad.eyebrow}
              </p>
              <h2 className="section-title mt-6 text-snow">
                <Words text={launchpad.titleA} />
                <br />
                <Words text={launchpad.titleB} /> <Words text={launchpad.titleAccent} className="accent text-gold" />
              </h2>
              <p data-fade className="mt-6 text-[16px] leading-[1.7] text-snow/80">
                {launchpad.body}
              </p>
              <div data-fade className="mt-9 flex flex-wrap items-center gap-6">
                <GoldButton href={launchpad.cta.href}>{launchpad.cta.label}</GoldButton>
                <a
                  href={launchpad.secondary.href}
                  className="group inline-flex items-center gap-2 border-b border-snow/30 pb-1 text-[14px] text-snow/85 transition-colors hover:border-gold hover:text-gold"
                >
                  {launchpad.secondary.label}
                  <ArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
