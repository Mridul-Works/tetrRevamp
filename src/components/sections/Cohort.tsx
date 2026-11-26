"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cohortHeading, cohortStats, tribe } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Counter from "@/components/ui/Counter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Cohort() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: vertical scroll drives the portrait track sideways
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth + 80;
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-portrait-img]").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: pin.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="cohort" aria-label="The cohort" className="relative bg-forest">
      <div className="container-x pt-[clamp(96px,9vw,144px)]">
        <Heading breakLine {...cohortHeading} />
      </div>

      <div ref={pin} className="relative overflow-hidden py-14 lg:flex lg:h-screen lg:items-center lg:py-0">
        <div ref={track} className="no-scrollbar flex gap-4 overflow-x-auto px-[clamp(20px,5vw,80px)] lg:overflow-visible">
          {tribe.map((t, i) => (
            <figure
              key={t.name}
              className="group relative aspect-[3/4] w-[70vw] shrink-0 overflow-hidden rounded-[20px] bg-slab sm:w-[340px] lg:w-[min(30vw,420px)]"
              style={{ marginTop: i % 2 ? "6vh" : 0 }}
            >
              <div data-portrait-img className="absolute -inset-x-[10%] inset-y-0">
                <Image src={t.image} alt={`${t.name}, Tetr student`} fill sizes="(min-width: 1024px) 30vw, 70vw" className="object-cover" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16">
                <span className="font-serif text-[28px] italic">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="container-x pb-[clamp(96px,9vw,144px)]">
        <dl className="grid grid-cols-2 border-y border-snow/10 sm:grid-cols-3 lg:grid-cols-6">
          {cohortStats.map((s, i) => (
            <div key={s.text} className={`flex flex-col gap-2 py-8 ${i > 0 ? "lg:border-l lg:border-snow/10 lg:pl-6" : ""}`}>
              <dt className="text-[clamp(32px,3.2vw,48px)] font-semibold leading-none tracking-tight">
                <Counter value={s.value} />
              </dt>
              <dd className="text-[13px] uppercase tracking-[0.1em] text-byline">{s.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
