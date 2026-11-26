"use client";

import { useRef } from "react";
import { creators, creatorsHeading } from "@/data/content";
import Heading from "@/components/ui/Heading";
import Postcard from "@/components/ui/Postcard";
import { NavArrows } from "@/components/ui/Button";

export default function Creators() {
  const row = useRef<HTMLUListElement>(null);
  const step = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 28), behavior: "smooth" });
  };

  return (
    <section id="creators" aria-label="Postcards from creators" className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-deep/40 blur-[140px]" />
      <div className="container-x relative">
        <Heading breakLine eyebrow="Postcards from creators" {...creatorsHeading}>
          <NavArrows name="creator" onPrev={() => step(-1)} onNext={() => step(1)} />
        </Heading>
      </div>

      {/* side padding lines the first card up with the container; the row scrolls edge to edge */}
      <ul ref={row} aria-label="Creator reels" className="pc-row relative mt-6 px-[clamp(20px,5vw,80px)]">
        {creators.map((c, i) => (
          <li key={c.instagram}>
            <Postcard
              image={c.image}
              alt={`${c.guest} filming at Tetr`}
              quote={c.title}
              by={c.guest}
              cta={
                <>
                  Watch on Instagram<span className="sr-only"> (opens in a new tab)</span> ↗
                </>
              }
              href={`https://www.instagram.com/p/${c.instagram}/`}
              tilt={i % 2 ? 1.8 : -2.4}
              lift={i % 2 ? 16 : 0}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
