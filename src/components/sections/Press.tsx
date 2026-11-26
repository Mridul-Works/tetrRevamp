"use client";

import Image from "next/image";
import { press, pressHeading } from "@/data/content";
import Heading from "@/components/ui/Heading";
import VelocityMarquee from "@/components/ui/VelocityMarquee";

export default function Press() {
  const half = Math.ceil(press.length / 2);
  const rows = [press.slice(0, half), press.slice(half)];

  return (
    <section id="press" aria-label="Tetr in the news" className="relative overflow-hidden bg-forest py-[clamp(96px,9vw,144px)]">
      <div className="container-x">
        <Heading breakLine {...pressHeading} />
      </div>
      <p className="container-x mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-snow/40">Scroll faster and the presses run faster</p>
      <div className="mt-8 flex flex-col gap-4">
        {rows.map((row, r) => (
          <VelocityMarquee key={r} speed={55} reverse={r === 1}>
            {row.map((p) => (
              <figure
                key={p.name}
                className="group relative mx-2 aspect-square w-[240px] shrink-0 overflow-hidden rounded-sm border border-snow/10 bg-snow transition-transform duration-500 hover:-translate-y-1 md:w-[300px]"
              >
                <Image
                  src={p.image}
                  alt={`${p.name} coverage of Tetr`}
                  fill
                  sizes="300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </figure>
            ))}
          </VelocityMarquee>
        ))}
      </div>
    </section>
  );
}
