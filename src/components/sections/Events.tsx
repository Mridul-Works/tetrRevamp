"use client";

import { useState } from "react";
import Image from "next/image";
import { events, eventsHeading, eventsLink } from "@/data/content";
import Heading from "@/components/ui/Heading";
import { NavArrows } from "@/components/ui/Button";
import { ArrowUpRight, Clock, MapPin } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const PER_PAGE = 3;
const status = {
  Offline: "bg-gold text-gold-ink",
  Online: "bg-mint text-ink",
  "Past Event": "bg-panel text-snow",
} as const;

export default function Events() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(events.length / PER_PAGE);
  const list = events.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section id="events" aria-label="Events" className="relative bg-paper py-[clamp(96px,9vw,144px)] text-ink">
      <div className="container-x">
        <Heading tone="light" breakLine {...eventsHeading}>
          <NavArrows name="events" tone="light" onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} prevDisabled={page === 0} nextDisabled={page >= pages - 1} />
        </Heading>

        <div key={page} className="mt-12 grid gap-6 md:grid-cols-3">
          {list.map((e, i) => {
            // "Sat, Jan 24, 2026" → weekday / month / day / year for the stub's date block
            const [dow = "", md = "", year = ""] = e.date.split(", ");
            const [month = "", day = ""] = md.split(" ");
            const past = e.status === "Past Event";
            return (
              <article
                key={e.title}
                className="group flex flex-col drop-shadow-[0_14px_30px_rgba(8,18,14,.10)] transition-[translate,filter] duration-500 ease-out-expo [animation:rise-in_.7s_var(--ease-out-expo)_both] hover:-translate-y-2 hover:drop-shadow-[0_30px_50px_rgba(8,18,14,.18)]"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {/* pass body */}
                <div className="flex flex-1 flex-col rounded-t-[20px] bg-snow p-3 pb-5">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[12px]">
                    <Image
                      src={e.image}
                      alt={e.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className={cn("object-cover transition-transform duration-700 group-hover:scale-105", past && "grayscale-[55%]")}
                    />
                    <span className={cn("absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]", status[e.status])}>
                      {e.status}
                    </span>
                  </div>
                  <h3 className="mt-5 px-3 text-[20px] font-semibold leading-snug">{e.title}</h3>
                  <p className="mt-2 line-clamp-3 px-3 text-[14px] leading-[1.6] text-byline-light">{e.desc}</p>
                </div>

                {/* perforation: the stub below tears away on hover */}
                <div className="relative h-0">
                  <span className="absolute -left-3 top-0 z-10 size-6 -translate-y-1/2 rounded-full bg-paper" />
                  <span className="absolute -right-3 top-0 z-10 size-6 -translate-y-1/2 rounded-full bg-paper" />
                  <span className="absolute inset-x-6 top-0 z-10 border-t-2 border-dashed border-ink/15" />
                </div>

                {/* stub */}
                <div className="flex origin-top-left items-center gap-4 rounded-b-[20px] bg-snow px-6 pb-5 pt-5 transition-transform duration-500 ease-out-expo group-hover:translate-y-1.5 group-hover:rotate-[1.4deg]">
                  <div className={cn("grid w-[62px] shrink-0 overflow-hidden rounded-[12px] text-center", past ? "bg-ink/50 text-snow" : "bg-ink text-snow")}>
                    <span className={cn("py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]", past ? "bg-ink/40" : "bg-deep text-mint")}>{month}</span>
                    <span className="pt-1 text-[26px] font-semibold leading-none">{day}</span>
                    <span className="pb-1.5 pt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-snow/60">{dow} · {year.slice(-2)}</span>
                  </div>
                  <ul className="min-w-0 flex-1 space-y-1.5 text-[13px] text-ink/80">
                    <li className="flex items-center gap-2">
                      <Clock width={14} height={14} className="shrink-0 text-deep" />
                      <span className="truncate">{e.time}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin width={14} height={14} className="shrink-0 text-deep" />
                      <span className="truncate">{e.place}</span>
                    </li>
                  </ul>
                  <a
                    href={eventsLink}
                    aria-label={`Open ${e.title}`}
                    className="grid size-11 shrink-0 place-items-center rounded-sm bg-deep text-snow transition-[transform,background-color,color] duration-300 group-hover:rotate-45 hover:bg-gold hover:text-gold-ink"
                  >
                    <ArrowUpRight width={16} height={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
