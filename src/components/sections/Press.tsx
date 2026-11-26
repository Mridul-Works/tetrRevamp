"use client";

import Image from "next/image";
import { press, pressHeading } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Marquee from "@/components/ui/Marquee";

export default function Press() {
  const half = Math.ceil(press.length / 2);
  const rows = [press.slice(0, half), press.slice(half)];

  return (
    <section id="press" aria-label="Tetr in the news" className="relative overflow-hidden bg-forest py-[clamp(96px,9vw,144px)]">
      <div className="container-x">
        <Heading breakLine {...pressHeading} />
      </div>
      <div className="mt-14 flex flex-col gap-4">
        {rows.map((row, r) => (
          <Marquee key={r} duration={48} reverse={r === 1}>
            {row.map((p) => (
              <figure
                key={p.name}
                className="group relative mx-2 aspect-[4/3] w-[300px] shrink-0 overflow-hidden rounded-[16px] border border-snow/10 bg-cream transition-transform duration-500 hover:-translate-y-1 md:w-[400px]"
              >
                <Image
                  src={p.image}
                  alt={`${p.name} coverage of Tetr`}
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </figure>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
