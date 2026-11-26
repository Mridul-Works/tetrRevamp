"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { creators, creatorsHeading } from "@/data/content";
import Heading from "@/components/ui/Heading";
import { NavArrows } from "@/components/ui/Button";
import { Instagram, Play } from "@/components/ui/icons";
import { usePlayVideo } from "@/components/ui/VideoModal";

/** Signed distance from the active card, wrapping around the deck. */
function offset(i: number, active: number, n: number) {
  let d = (i - active + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

export default function Creators() {
  const n = creators.length;
  const [active, setActive] = useState(Math.floor(n / 2));
  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);
  const play = usePlayVideo();
  const down = useRef<number | null>(null);
  const cur = creators[active];
  const open = (c: (typeof creators)[number]) => play({ title: c.title, instagram: c.instagram });

  return (
    <section id="creators" aria-label="Creator videos" className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-deep/50 blur-[140px]" />
      <div className="container-x relative">
        <Heading breakLine {...creatorsHeading} />

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Creator videos"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(active - 1);
            if (e.key === "ArrowRight") go(active + 1);
          }}
          onPointerDown={(e) => (down.current = e.clientX)}
          onPointerUp={(e) => {
            if (down.current === null) return;
            const dx = e.clientX - down.current;
            down.current = null;
            if (Math.abs(dx) > 45) go(active + (dx < 0 ? 1 : -1));
          }}
          className="relative mt-14 h-[clamp(440px,52vw,620px)] select-none [perspective:1600px]"
        >
          {creators.map((c, i) => {
            const d = offset(i, active, n);
            const center = d === 0;
            const far = Math.abs(d) > 2;
            return (
              <button
                key={c.title}
                type="button"
                tabIndex={far ? -1 : 0}
                aria-hidden={far || undefined}
                aria-current={center || undefined}
                aria-label={center ? `Play ${c.title} by ${c.guest}` : `Show ${c.title} by ${c.guest}`}
                onClick={() => (center ? open(c) : go(i))}
                style={{
                  zIndex: 20 - Math.abs(d),
                  opacity: far ? 0 : 1,
                  pointerEvents: far ? "none" : "auto",
                  transform: `translate(-50%, -50%) translateX(${d * 62}%) translateZ(${-Math.abs(d) * 140}px) rotateY(${-d * 14}deg) rotate(${d * 2}deg) scale(${center ? 1 : 0.86})`,
                }}
                className="absolute left-1/2 top-1/2 aspect-[9/16] h-full overflow-hidden rounded-[22px] bg-forest shadow-[0_40px_80px_rgba(0,0,0,.55)] transition-[transform,opacity,filter] duration-700 ease-out-expo"
              >
                <Image src={c.image} alt="" fill sizes="360px" draggable={false} className="object-cover" />
                <span className={`absolute inset-0 bg-ink transition-opacity duration-700 ${center ? "opacity-0" : "opacity-45"}`} />
                {center && (
                  // the card itself is the play button, so this is purely visual
                  <span aria-hidden className="absolute inset-0 grid place-items-center">
                    <span className="grid size-[72px] place-items-center rounded-full border border-white/25 bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,.35)] backdrop-blur-md transition-transform duration-300 hover:scale-110">
                      <Play width={24} height={24} className="translate-x-[1px]" />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <div key={cur.title} aria-live="polite" className="[animation:rise-in_.6s_var(--ease-out-expo)_both]">
            <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-mint">
              <Instagram width={16} height={16} /> {cur.guest}
            </p>
            <p className="mt-2 font-serif text-[clamp(24px,2.6vw,36px)] italic">{cur.title}</p>
          </div>
          <NavArrows name="video" onPrev={() => go(active - 1)} onNext={() => go(active + 1)} />
        </div>
      </div>
    </section>
  );
}
