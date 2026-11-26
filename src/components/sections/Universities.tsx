"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { universities, universitiesHeading } from "@/data/content";
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
      // Desktop: pin the stage; photos fly out from the centre into the collage, then drift apart as it releases
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = stage.current!;
        const tiles = gsap.utils.toArray<HTMLElement>("[data-uni-tile]", el);
        // offset from a tile's resting centre to the stage centre (layout box, ignores transforms)
        const dx = (t: HTMLElement) => el.clientWidth / 2 - (t.offsetLeft + t.offsetWidth / 2);
        const dy = (t: HTMLElement) => el.clientHeight / 2 - (t.offsetTop + t.offsetHeight / 2);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=160%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        tl.fromTo("[data-uni-ctr]", { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" }, 0.03);
        tiles.forEach((t, i) => {
          tl.fromTo(
            t,
            { x: () => dx(t), y: () => dy(t), scale: 0, opacity: 0 },
            { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.46, ease: "power3.out" },
            i * 0.06,
          );
        });
        tiles.forEach((t) => {
          tl.to(t, { x: () => -dx(t) * 0.16, y: () => -dy(t) * 0.16, scale: 1.06, duration: 0.14 }, 0.86);
        });
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
              className="uni-tile group overflow-hidden rounded-[14px] bg-forest will-change-transform"
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
              <div className="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-snow/10" />
              <div className="absolute inset-0 grid place-items-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.logo}
                  alt={u.name}
                  loading="lazy"
                  style={{ "--lh": u.logoH } as React.CSSProperties}
                  className={cn(
                    "uni-logo w-auto max-w-[75%] object-contain transition-transform duration-500 group-hover:scale-105",
                    u.nativeColor && "box-content rounded-md bg-snow px-3 py-2",
                  )}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
