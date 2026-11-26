"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cohortHeading, cohortStats, tribe } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Counter from "@/components/ui/Counter";
import Postcard from "@/components/ui/Postcard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Cohort() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: vertical scroll drives the postcard track sideways
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
        // portraits drift inside their wells; scaled up so the pan never shows an edge
        gsap.utils.toArray<HTMLElement>(".pc__img img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -5, scale: 1.12 }, { xPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: pin.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="cohort" aria-label="The cohort" className="relative overflow-hidden bg-forest">
      <div className="container-x pt-[clamp(96px,9vw,144px)]">
        <Heading breakLine eyebrow="Postcards from the cohort" {...cohortHeading} />
      </div>

      <div ref={pin} className="relative py-10 lg:flex lg:h-screen lg:items-center lg:py-0">
        <ul ref={track} aria-label="Students of the cohort" className="pc-row px-[clamp(20px,5vw,80px)] lg:overflow-visible">
          {tribe.map((t, i) => (
            <li key={t.name}>
              <Postcard
                image={t.image}
                alt={`${t.name}, Tetr student`}
                quote={t.name}
                quoted={false}
                by="Tetr student"
                cta={`No. ${String(i + 1).padStart(2, "0")} / ${String(tribe.length).padStart(2, "0")}`}
                stamp={{ top: "TETR", big: "4", bottom: "YEARS" }}
                mark={{ place: "Cohort", sub: "70+ nations" }}
                tilt={i % 2 ? 1.8 : -2.4}
                lift={i % 2 ? 16 : 0}
                sizes="(min-width: 640px) 300px, 260px"
              />
            </li>
          ))}
        </ul>
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
