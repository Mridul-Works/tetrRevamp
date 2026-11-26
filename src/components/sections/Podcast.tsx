"use client";

import { useState } from "react";
import Image from "next/image";
import { podcastHeading, podcastTabs, podcasts, type Episode } from "@/data/content";
import Heading from "@/components/ui/Heading";
import { Mic, Play } from "@/components/ui/icons";
import { usePlayVideo } from "@/components/ui/VideoModal";
import { cn } from "@/lib/cn";

export default function Podcast() {
  const [tab, setTab] = useState<(typeof podcastTabs)[number]>("Podcasts");
  const list = podcasts[tab];

  return (
    <section id="podcast" aria-label="Podcast" className="relative bg-paper py-[clamp(96px,9vw,144px)] text-ink">
      <div className="container-x">
        <Heading tone="light" breakLine {...podcastHeading} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10">
          <div role="tablist" aria-label="Podcast series" className="no-scrollbar flex overflow-x-auto">
            {podcastTabs.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={t === tab}
                onClick={() => setTab(t)}
                className={cn(
                  "-mb-px shrink-0 border-b-2 px-4 pb-4 pt-2 text-[14px] font-semibold transition-colors",
                  t === tab ? "border-deep text-ink" : "border-transparent text-byline-light hover:text-deep",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="flex items-center gap-2 pb-4 text-[13px] text-byline-light">
            <Mic width={16} height={16} />
            {tab === "Admissions" ? "Admissions" : "Tetr Uncut"} · {list.length} {list.length === 1 ? "episode" : "episodes"}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="mt-8 grid min-h-[320px] place-items-center rounded-[24px] border border-dashed border-ink/15 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink/5 text-deep">
                <Mic />
              </span>
              <p className="mt-4 text-[20px] font-semibold">New {tab.toLowerCase()} episodes are on the way</p>
              <p className="mt-1 text-[14px] text-byline-light">Switch to Podcasts to listen to the latest conversations.</p>
            </div>
          </div>
        ) : (
          <Stage key={tab} list={list} />
        )}
      </div>
    </section>
  );
}

function Stage({ list }: { list: Episode[] }) {
  const [i, setI] = useState(() => Math.max(0, list.findIndex((e) => e.featured)));
  const ep = list[i] ?? list[0];
  const play = usePlayVideo();
  const start = (e: Episode) => play({ title: e.title, youtube: e.youtube });

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[24px] bg-ink text-snow">
        <button
          type="button"
          onClick={() => start(ep)}
          aria-label={`Play ${ep.title} with ${ep.guest}`}
          className="group relative block aspect-video w-full overflow-hidden"
        >
          <Image key={ep.image} src={ep.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition-transform duration-1000 [animation:fade-in_.6s_ease] group-hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-snow/15 text-snow backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-gold-ink">
            <Play width={26} height={26} />
          </span>
        </button>
        <div key={ep.title} aria-live="polite" className="flex flex-col gap-4 p-6 [animation:rise-in_.6s_var(--ease-out-expo)_both] md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-[640px]">
            <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.12em] text-mint">
              <span>
                EP {String(i + 1).padStart(2, "0")}
                <span className="text-snow/40"> / {String(list.length).padStart(2, "0")}</span>
              </span>
              <span className="h-px w-6 bg-snow/25" />
              <span className="normal-case tracking-normal text-snow/80">{ep.guest}</span>
            </p>
            <p className="mt-3 text-[clamp(18px,1.7vw,24px)] font-semibold leading-snug">{ep.title}</p>
          </div>
          <button
            type="button"
            onClick={() => start(ep)}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-gold px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-ink transition-colors hover:bg-[#ffd75e]"
          >
            <Play width={14} height={14} />
            Play Episode
          </button>
        </div>
      </div>

      <div data-lenis-prevent className="grid max-h-[640px] content-start gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
        {list.map((e, n) =>
          n === i ? null : (
            <div key={e.title} className="group relative aspect-video overflow-hidden rounded-[16px] bg-deep">
              <button type="button" onClick={() => setI(n)} aria-label={`Show ${e.title} with ${e.guest}`} className="absolute inset-0">
                <Image src={e.image} alt="" fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="absolute bottom-3 left-4 right-14 text-left text-[13px] font-semibold text-snow">{e.guest}</span>
              </button>
              <button
                type="button"
                onClick={() => start(e)}
                aria-label={`Play ${e.title}`}
                className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-snow/20 text-snow backdrop-blur transition-colors hover:bg-gold hover:text-gold-ink"
              >
                <Play width={13} height={13} />
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
