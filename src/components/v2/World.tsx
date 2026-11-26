"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Counter from "@/components/ui/Counter";
import Postmark from "@/components/ui/Postmark";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { v2Countries, v2World, type ToyKey } from "@/data/v2";
import CountrySketch from "./CountrySketch";
import CountryPattern from "./CountryPattern";
import ChaiStall from "./toys/ChaiStall";
import BuildBurj from "./toys/BuildBurj";
import FactoryLine from "./toys/FactoryLine";
import KenteLoom from "./toys/KenteLoom";
import RingBell from "./toys/RingBell";
import PenaltyKick from "./toys/PenaltyKick";
import LightsOut from "./toys/LightsOut";

const RouteGlobe = dynamic(() => import("@/components/three/RouteGlobe"), { ssr: false });

const TOYS: Record<ToyKey, React.ComponentType> = {
  chai: ChaiStall,
  burj: BuildBurj,
  factory: FactoryLine,
  kente: KenteLoom,
  bell: RingBell,
  penalty: PenaltyKick,
  lights: LightsOut,
};

const points = v2Countries.map((c) => c.coords);
const labels = v2Countries.map((c) => c.name);
const N = v2Countries.length;

/**
 * The route as a playable world. Pick a stop on the tabs or the globe: the whole stage
 * takes that country's colour and motif, its landmark sketches itself in, and its toy loads.
 * Visiting all seven fills the passport.
 */
export default function World() {
  const [i, setI] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const { ref, inView } = useInView<HTMLDivElement>("100px");
  const c = v2Countries[i];
  const Toy = TOYS[c.toy.key];
  const full = visited.length === N;

  // On phones the globe box has a fixed size, so nothing ever resizes after mount and the
  // 3D canvas can miss its first measurement (it stays at the 300x150 default). Nudge it
  // with a resize until the canvas has taken the size of its box.
  useEffect(() => {
    if (!inView) return;
    let tries = 0;
    const t = setInterval(() => {
      const box = ref.current;
      const canvas = box?.querySelector("canvas");
      if (canvas && box && Math.abs(canvas.clientWidth - box.clientWidth) <= 4) return clearInterval(t);
      if (canvas) window.dispatchEvent(new Event("resize"));
      if (++tries > 20) clearInterval(t);
    }, 300);
    return () => clearInterval(t);
  }, [inView, ref]);

  const go = (n: number) => {
    const k = (n + N) % N;
    setI(k);
    setVisited((v) => (v.includes(k) ? v : [...v, k]));
  };

  return (
    <section id="route" className="grain relative scroll-mt-16 overflow-hidden bg-forest text-cream transition-[--c] duration-700" style={{ "--c": c.accent } as React.CSSProperties}>
      {/* the country's own colour and motif wash the whole stage */}
      <div className="pointer-events-none absolute inset-0 opacity-25 transition-[background] duration-700" style={{ background: "radial-gradient(900px circle at 78% 18%, var(--c), transparent 62%)" }} />
      <CountryPattern key={`pat-${c.name}`} country={c.name} className="opacity-[0.16] [animation:fade-in_.9s_both]" />

      <div className="container-x relative py-24 md:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="v2-display text-[clamp(44px,6.4vw,104px)] text-snow">
            {v2World.title}{" "}
            <span className="accent normal-case transition-colors duration-700" style={{ color: "var(--c)", fontSize: "0.86em" }}>
              {v2World.accent}
            </span>
          </h2>
          <p className="max-w-[40ch] text-[15px] leading-[1.5] text-cream/70">{v2World.sub}</p>
        </div>

        {/* the seven stops */}
        <div
          role="tablist"
          aria-label="Countries on the route"
          className="no-scrollbar mt-10 flex gap-2 overflow-x-auto"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(i + 1);
            if (e.key === "ArrowLeft") go(i - 1);
          }}
        >
          {v2Countries.map((k, n) => {
            const on = n === i;
            return (
              <button
                key={k.name}
                role="tab"
                type="button"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => go(n)}
                className={cn(
                  "group/tab relative flex shrink-0 items-baseline gap-3 border px-4 py-3 text-left transition-colors duration-300",
                  on ? "border-transparent text-ink" : "border-snow/15 text-cream/75 hover:border-snow/40 hover:text-snow",
                )}
                style={on ? { background: k.accent } : undefined}
              >
                <span className="v2-mono text-[10.5px] opacity-70">{k.term}</span>
                <span className="v2-display text-[22px] leading-none">{k.name}</span>
                {!on && visited.includes(n) && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full" style={{ background: k.accent }} />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* globe: spins to the stop, and its labels are buttons too */}
          <div ref={ref} className="relative h-[400px] overflow-hidden border border-snow/10 bg-ink/40 lg:col-span-5 lg:h-auto lg:min-h-[640px]">
            <div className="absolute inset-0 transition-[background] duration-700" style={{ background: "radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--c) 34%, transparent), transparent 64%)" }} />
            <div className="absolute inset-0">
              <RouteGlobe points={points} labels={labels} active={i} onSelect={go} running={inView} />
            </div>
            <p className="v2-mono pointer-events-none absolute top-4 left-4 text-cream/60">
              Term {c.term} <span className="mx-1.5 opacity-40">/</span> <span style={{ color: "var(--c)" }}>{c.city}</span>
            </p>

            {/* postcard of the thing the country is famous for */}
            <figure key={`card-${c.name}`} className="v2-pop pointer-events-none absolute bottom-4 left-4 w-[42%] max-w-[210px] -rotate-3 border-[5px] border-cream bg-cream shadow-[0_24px_50px_rgba(0,0,0,.5)]">
              <img src={c.landmark.image} alt={c.landmark.title} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="v2-mono px-1 pt-1.5 pb-0.5 text-[9.5px] text-ink">{c.landmark.title}</figcaption>
              <Postmark key={c.city} place={c.city} color={c.accent} tilt={9} className="absolute -top-7 -right-10 w-[120px]" />
            </figure>

            <div className="absolute right-4 bottom-4 flex gap-2">
              <button type="button" onClick={() => go(i - 1)} aria-label="Previous country" className="grid size-11 place-items-center border border-snow/25 bg-ink/60 text-snow backdrop-blur-sm transition-colors hover:border-[var(--c)] hover:text-[var(--c)]">
                ←
              </button>
              <button type="button" onClick={() => go(i + 1)} aria-label="Next country" className="grid size-11 place-items-center border border-snow/25 bg-ink/60 text-snow backdrop-blur-sm transition-colors hover:border-[var(--c)] hover:text-[var(--c)]">
                →
              </button>
            </div>
          </div>

          {/* the country: greeting, sketch, what it is famous for, and its toy */}
          <div role="tabpanel" aria-label={c.name} className="flex flex-col border border-snow/10 bg-ink/45 backdrop-blur-sm lg:col-span-7">
            <div key={`head-${c.name}`} className="grid gap-4 p-6 sm:grid-cols-[1fr_minmax(0,280px)] sm:items-end md:p-8">
              <div className="[animation:rise-in_.6s_var(--ease-out-expo)_both]">
                <p className="accent text-[clamp(26px,2.6vw,40px)] leading-none" style={{ color: "var(--c)" }}>
                  {c.greeting},
                </p>
                <h3 className="v2-display mt-1 text-[clamp(56px,6.6vw,108px)] text-snow">{c.name}</h3>
                <p className="v2-mono mt-3 text-gold">{c.tag}</p>
              </div>
              <CountrySketch country={c.name} className="text-cream" />
            </div>

            <ul key={`famous-${c.name}`} className="flex flex-wrap gap-2 border-t border-snow/10 px-6 py-4 md:px-8">
              <li className="v2-mono self-center pr-2 text-cream/50">Famous for</li>
              {c.famous.map((f, n) => (
                <li key={f} className="v2-mono v2-pop border px-2.5 py-1.5 text-cream" style={{ borderColor: "color-mix(in oklab, var(--c) 55%, transparent)", animationDelay: `${n * 60}ms` }}>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-1 flex-col gap-5 border-t border-snow/10 p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p className="v2-mono flex items-center gap-2" style={{ color: "var(--c)" }}>
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 rounded-full [animation:ping-slow_1.8s_ease-out_infinite]" style={{ background: "var(--c)" }} />
                    <span className="relative size-2 rounded-full" style={{ background: "var(--c)" }} />
                  </span>
                  Play · {c.toy.title}
                </p>
                <p className="text-[13.5px] text-cream/60">{c.toy.hint}</p>
              </div>
              <div key={`toy-${c.name}`} className="[animation:fade-in_.5s_both]">
                <Toy />
              </div>
            </div>

            <div className="grid gap-4 border-t border-snow/10 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <p className="text-[13.5px] leading-[1.5] text-cream/65">
                <span className="v2-mono mr-2 text-cream/45">What you build here</span>
                {c.build}
              </p>
              <a href={v2World.cta.href} className="v2-mono inline-flex h-12 items-center justify-center px-5 font-semibold text-ink transition-transform hover:-translate-y-0.5" style={{ background: "var(--c)" }}>
                {v2World.cta.label} →
              </a>
            </div>
          </div>
        </div>

        {/* passport: one stamp per stop you have opened */}
        <div className="mt-6 flex flex-col gap-4 border border-snow/10 bg-ink/40 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <p className="v2-mono text-cream/60">
              Passport <span className="text-snow">{visited.length}/{N}</span>
            </p>
            <ul className="flex gap-1.5">
              {v2Countries.map((k, n) => {
                const got = visited.includes(n);
                return (
                  <li key={k.name}>
                    <button
                      type="button"
                      onClick={() => go(n)}
                      aria-label={`${k.name}${got ? ", stamped" : ""}`}
                      className={cn("grid size-9 place-items-center rounded-full border border-dashed text-[10px] transition-all duration-300", got ? "v2-pop -rotate-12 border-solid" : "border-snow/25 text-cream/35")}
                      style={got ? { borderColor: k.accent, color: k.accent } : undefined}
                    >
                      <span className="v2-mono text-[9px]">{k.name.slice(0, 3)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {full ? (
            <p className="v2-pop flex flex-wrap items-center gap-4 text-[15px] text-snow">
              Passport full. You did the route in a few minutes; the real one takes four years.
              <a href="#lead" className="v2-mono inline-flex h-10 items-center bg-gold px-4 font-semibold text-gold-ink">
                Start for real →
              </a>
            </p>
          ) : (
            <p className="text-[14px] text-cream/60">Open every stop to fill your passport. {N - visited.length} to go.</p>
          )}
        </div>

        <ul className="mt-14 grid grid-cols-2 border-t border-snow/10 md:grid-cols-4">
          {v2World.stats.map((s, n) => (
            <li key={s.label} className={cn("py-7", n > 0 && "md:border-l md:border-snow/10 md:pl-7", n % 2 === 1 && "border-l border-snow/10 pl-5 md:pl-7")}>
              <Counter value={s.value} className="v2-display block text-[clamp(40px,5vw,80px)] text-snow" />
              <p className="v2-mono mt-2 text-cream/55">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
