"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { immersions, immersionsHeading } from "@/data/content";
import { Bold } from "@/components/ui/RichText";
import { useWordReveal, Words } from "@/components/ui/Heading";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Note = (typeof immersions)[number]["notes"][number];

function NoteCard({ note, delay, className }: { note: Note; delay: number; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-end rounded-[18px] border border-snow/10 bg-ink/55 p-5 backdrop-blur-md [animation:rise-in_.8s_var(--ease-out-expo)_both]",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="eyebrow" style={{ color: "var(--acc)" }}>
        {note.kind === "business" ? "Business Immersion" : "Cultural Immersion"}
      </span>
      <h3 className="mt-2 text-[19px] font-semibold leading-tight">{note.title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-[1.55] text-snow/75">{note.desc}</p>
    </div>
  );
}

function Photo({ src, alt, delay, className, children }: { src: string; alt: string; delay: number; className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-[18px] bg-forest [animation:wipe-up_1s_var(--ease-out-expo)_both]", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover [animation:settle_2.4s_var(--ease-out-expo)_both]" />
      {children}
    </div>
  );
}

export default function Immersions() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const c = immersions[i];
  const head = useWordReveal<HTMLDivElement>();

  const step = (d: number) => {
    setDir(d);
    setI((v) => (v + d + immersions.length) % immersions.length);
  };

  // warm the next country's photos
  useEffect(() => {
    const next = immersions[(i + dir + immersions.length) % immersions.length];
    [next.bg, ...next.images].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [i, dir]);

  return (
    <section
      id="immersions"
      aria-label="Business and cultural immersions"
      className="relative overflow-hidden bg-ink py-[clamp(96px,9vw,144px)]"
      style={{ "--acc": c.accent } as React.CSSProperties}
    >
      {/* full-bleed country backdrop */}
      <div key={c.bg} className="absolute inset-0 [animation:fade-in_1.2s_ease_both]">
        <Image src={c.bg} alt="" fill sizes="100vw" className="object-cover opacity-35 [animation:settle_8s_ease-out_both]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      <div className="absolute inset-0 transition-[background] duration-1000" style={{ background: `radial-gradient(60% 50% at 70% 40%, ${c.accent}33, transparent 70%)` }} />

      <div className="container-x relative">
        <div ref={head} className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
          <h2 className="section-title max-w-[860px]">
            <Words text={immersionsHeading.titleA} /> <Words text={immersionsHeading.titleB} className="accent" />
          </h2>
          <p data-fade className="max-w-[540px] text-[15.5px] leading-[1.65] text-byline">
            <Bold text={immersionsHeading.body} />
          </p>
        </div>

        <div key={c.name} className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[220px_220px_220px] md:gap-4">
          <Photo src={c.images[0]} alt={`${c.name} cohort`} delay={0} className="col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <b className="block text-[clamp(32px,4vw,56px)] font-semibold leading-none tracking-tight">{c.name}</b>
              <span className="mt-2 block font-mono text-[12px] uppercase tracking-[0.14em]" style={{ color: "var(--acc)" }}>
                {c.tag}
              </span>
            </div>
          </Photo>
          <NoteCard note={c.notes[0]} delay={60} className="md:col-start-3 md:row-start-1" />
          <Photo src={c.images[2]} alt={`${c.name} business immersion`} delay={120} className="aspect-square md:col-start-4 md:row-start-1 md:aspect-auto" />
          <Photo src={c.images[3]} alt={`${c.name} cultural immersion`} delay={180} className="aspect-square md:col-start-3 md:row-start-2 md:aspect-auto" />
          <NoteCard note={c.notes[2]} delay={240} className="md:col-start-4 md:row-start-2" />
          <NoteCard note={c.notes[3]} delay={300} className="md:col-start-1 md:row-start-3" />
          <Photo src={c.images[1]} alt={`${c.name} campus life`} delay={360} className="aspect-square md:col-start-2 md:row-start-3 md:aspect-auto" />
          <NoteCard note={c.notes[1]} delay={420} className="md:col-start-3 md:row-start-3" />
          <div className="col-span-2 flex items-center justify-center gap-5 rounded-[18px] border border-snow/10 bg-ink/40 p-4 backdrop-blur md:col-span-1 md:col-start-4 md:row-start-3">
            <button
              type="button"
              aria-label="Previous country"
              onClick={() => step(-1)}
              className="grid size-12 place-items-center rounded-sm border border-snow/25 transition-colors hover:border-[var(--acc)] hover:text-[var(--acc)]"
            >
              <ChevronLeft />
            </button>
            <span aria-hidden className="font-mono text-[14px] tabular-nums">
              {String(i + 1).padStart(2, "0")} <i className="not-italic text-snow/40">/</i> {String(immersions.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Next country"
              onClick={() => step(1)}
              className="grid size-12 place-items-center rounded-sm text-ink transition-transform hover:scale-105"
              style={{ background: "var(--acc)" }}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
