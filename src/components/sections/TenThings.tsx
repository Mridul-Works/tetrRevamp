"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { tenThings, tenThingsIntro } from "@/data/content";
import { Accented } from "@/components/ui/RichText";
import { NavArrows } from "@/components/ui/Button";
import { useWordReveal, Words } from "@/components/ui/Heading";
import { useAutoIndex, useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const DURATION = 6000;

export default function TenThings() {
  const total = tenThings.length + 1;
  const { ref: viewRef, inView } = useInView<HTMLElement>("-20% 0px");
  const { index, nonce, go } = useAutoIndex(total, DURATION, inView);
  const prev = useRef(0);
  const slide = index === 0 ? null : tenThings[index - 1];
  const images = [tenThingsIntro.image, ...tenThings.map((t) => t.image)];
  const headRef = useWordReveal<HTMLDivElement>();

  // the previously committed slide stays underneath while the new one wipes in
  const outgoing = prev.current;
  useEffect(() => {
    prev.current = index;
  }, [index]);

  return (
    <section ref={viewRef} aria-label="10 things to know about Tetr" className="relative overflow-hidden bg-ink py-[clamp(80px,9vw,140px)]">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          {/* Media */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-forest lg:aspect-auto lg:min-h-[600px]">
            {images.map((src, i) => (
              <div
                key={i === index ? `${src}-${nonce}-${index}` : src}
                className={cn(
                  "absolute inset-0",
                  i === index ? "z-20 [animation:wipe-in_1.2s_var(--ease-out-expo)_both]" : i === outgoing ? "z-10" : "invisible",
                )}
              >
                <Image
                  src={src}
                  alt={i === 0 ? "Tetr cohort in Dubai" : tenThings[i - 1].tag}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={cn("object-cover", i === index && "[animation:settle_6s_ease-out_both]")}
                  priority={i === 0}
                />
              </div>
            ))}
            <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 z-30 font-mono text-[12px] uppercase tracking-[0.16em] text-snow/80">
              {slide ? slide.tag : "Tetr"}
            </div>
            <div className="text-stroke pointer-events-none absolute -right-2 bottom-0 z-30 select-none font-serif text-[clamp(120px,16vw,240px)] italic leading-[0.8] text-snow/40">
              {String(index).padStart(2, "0")}
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-between gap-10">
            <div key={index} className="[animation:rise-in_.8s_var(--ease-out-expo)_both]">
              {slide ? (
                <>
                  <p className="eyebrow flex items-center gap-3 text-mint">
                    <span className="h-px w-8 bg-mint" />
                    {String(index).padStart(2, "0")} · {slide.tag}
                  </p>
                  <h2 className="section-title mt-6 text-snow">
                    <Accented text={slide.title} />
                  </h2>
                  <p className="mt-6 max-w-[520px] text-[16px] leading-[1.65] text-byline">{slide.body}</p>
                  {slide.stats.length > 0 && (
                    <dl className="mt-10 grid max-w-[480px] grid-cols-2 gap-6 border-t border-snow/10 pt-8">
                      {slide.stats.map((s) => (
                        <div key={s.label}>
                          <dt className="text-[clamp(30px,3vw,44px)] font-semibold tracking-tight text-snow">{s.value}</dt>
                          <dd className="mt-1 text-[13px] uppercase tracking-[0.12em] text-byline">{s.label}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </>
              ) : (
                <div ref={headRef}>
                  <h2 className="section-title text-snow">
                    <Words text="10 Things to Know" />{" "}
                    <Words text="About Tetr" className="accent" />
                  </h2>
                  <p data-fade className="mt-6 max-w-[520px] text-[16px] leading-[1.65] text-byline">
                    {tenThingsIntro.body}
                  </p>
                </div>
              )}
            </div>

            <div>
              <div role="tablist" aria-label="Slides" className="flex gap-1.5">
                {Array.from({ length: total }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => go(i)}
                    className="group relative h-6 flex-1"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-snow/15 transition-colors group-hover:bg-snow/30">
                      {i < index && <span className="absolute inset-0 bg-snow/60" />}
                      {i === index && (
                        <span
                          key={nonce}
                          className={cn("absolute inset-0 origin-left bg-mint", inView ? "animate-progress" : "scale-x-0")}
                          style={{ "--progress-duration": `${DURATION}ms` } as React.CSSProperties}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-mono text-[12px] tabular-nums text-snow/60">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <NavArrows name="slide" onPrev={() => go(index - 1)} onNext={() => go(index + 1)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
