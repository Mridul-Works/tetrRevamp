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
    <section id="podcast" aria-label="Podcast" className="relative overflow-hidden bg-paper py-[clamp(96px,9vw,144px)] text-ink">
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
          <div className="mt-8 grid min-h-[320px] place-items-center rounded-sm border border-dashed border-ink/15 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-sm bg-ink/5 text-deep">
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

/** Featured player on the left, the playlist on the right, a strip of thumbnails below. */
function Stage({ list }: { list: Episode[] }) {
  const [i, setI] = useState(() => Math.max(0, list.findIndex((e) => e.featured)));
  const ep = list[i] ?? list[0];
  const play = usePlayVideo();
  const start = (e: Episode) => play({ title: e.title, youtube: e.youtube });

  return (
    <div className="mt-8 overflow-hidden rounded-sm bg-ink p-4 text-snow md:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* featured */}
        <button
          type="button"
          data-cursor="Play"
          onClick={() => start(ep)}
          aria-label={`Play ${ep.title} with ${ep.guest}`}
          className="group relative block aspect-video w-full overflow-hidden rounded-sm bg-forest"
        >
          <Image key={ep.image} src={ep.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition-transform duration-1000 [animation:fade-in_.6s_ease] group-hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
          {/* big central play */}
          <span className="absolute left-1/2 top-1/2 grid size-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-sm bg-snow text-ink shadow-[0_18px_50px_rgba(0,0,0,.45)] transition-transform duration-500 ease-out-expo group-hover:scale-110 md:size-[104px]">
            <Play width={34} height={34} className="translate-x-[2px]" />
          </span>
          {/* equaliser wakes up on hover */}
          <span aria-hidden className="eq absolute bottom-7 right-7 flex h-7 items-end gap-[3px]">
            {[0, 1, 2, 3, 4].map((n) => (
              <span key={n} className="block h-full w-[3px] bg-mint" />
            ))}
          </span>
          <span key={ep.title} className="absolute bottom-5 left-6 right-24 text-left [animation:rise-in_.5s_var(--ease-out-expo)_both]">
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-mint">
              EP {String(i + 1).padStart(2, "0")} · {ep.guest}
            </span>
            <span className="mt-1.5 line-clamp-2 block text-[clamp(20px,2.4vw,34px)] font-semibold leading-tight tracking-tight">{ep.title}</span>
          </span>
        </button>

        {/* playlist */}
        <ol aria-label="Episodes" className="flex flex-col gap-1.5">
          {list.map((e, n) => {
            const on = n === i;
            return (
              <li
                key={e.title}
                className={cn(
                  "group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-sm border p-2.5 pr-3 transition-colors duration-300",
                  on ? "border-snow/15 bg-snow/[0.08]" : "border-transparent hover:bg-snow/[0.04]",
                )}
              >
                <button type="button" onClick={() => setI(n)} aria-current={on || undefined} className="grid min-w-0 grid-cols-[112px_minmax(0,1fr)] items-center gap-4 text-left">
                  <span className="relative aspect-video overflow-hidden rounded-sm bg-deep">
                    <Image src={e.image} alt="" fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {on && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-mint" />}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("line-clamp-2 block text-[15.5px] font-semibold leading-snug transition-colors", on ? "text-snow" : "text-snow/85 group-hover:text-snow")}>{e.guest}</span>
                    <span className="mt-1 block text-[12.5px] text-snow/50">{e.youtube ? "Watch on YouTube" : "Coming soon"}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => start(e)}
                  aria-label={`Play ${e.title}`}
                  className={cn(
                    "grid size-11 place-items-center rounded-sm border transition-[background-color,color,transform,border-color] duration-300 hover:scale-105",
                    on ? "border-snow bg-snow text-ink" : "border-snow/20 text-snow/60 group-hover:border-snow/50 group-hover:text-snow",
                  )}
                >
                  <Play width={14} height={14} className="translate-x-[1px]" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* strip of thumbnails */}
      <ul aria-label="Browse episodes" className="no-scrollbar mt-5 flex gap-3 overflow-x-auto">
        {list.map((e, n) => (
          <li key={e.title} className="shrink-0">
            <button
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show ${e.guest}`}
              className={cn(
                "group relative block aspect-[16/9] w-[200px] overflow-hidden rounded-sm bg-deep ring-1 transition-[ring-color,opacity] duration-300 md:w-[230px]",
                n === i ? "ring-mint" : "opacity-70 ring-snow/10 hover:opacity-100",
              )}
            >
              <Image src={e.image} alt="" fill sizes="230px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
