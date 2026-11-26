"use client";

import { useState } from "react";
import Image from "next/image";
import { events, eventsHeading, eventsLink } from "@/data/content";
import Heading from "@/components/ui/Heading";
import { NavArrows } from "@/components/ui/Button";
import { ArrowUpRight, Calendar, Clock, MapPin } from "@/components/ui/icons";
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

        <div key={page} className="mt-12 grid gap-5 md:grid-cols-3">
          {list.map((e, i) => (
            <article
              key={e.title}
              className="group flex flex-col overflow-hidden rounded-[20px] border border-ink/10 bg-snow transition-shadow duration-500 [animation:rise-in_.7s_var(--ease-out-expo)_both] hover:shadow-[0_30px_60px_rgba(8,18,14,.12)]"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={e.image} alt={e.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className={cn("absolute left-4 top-4 rounded-md px-3 py-1 text-[12.5px] font-semibold", status[e.status])}>{e.status}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[20px] font-semibold leading-snug">{e.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-byline-light">{e.desc}</p>
                <div className="mt-auto flex items-end justify-between gap-4 border-t border-ink/10 pt-5">
                  <ul className="space-y-1.5 text-[13px] text-ink/80">
                    <li className="flex items-center gap-2">
                      <Clock width={15} height={15} className="text-deep" />
                      {e.time}
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar width={15} height={15} className="text-deep" />
                      {e.date}
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin width={15} height={15} className="text-deep" />
                      {e.place}
                    </li>
                  </ul>
                  <a
                    href={eventsLink}
                    aria-label={`Open ${e.title}`}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-deep text-snow transition-transform duration-300 group-hover:rotate-45 hover:bg-gold hover:text-gold-ink"
                  >
                    <ArrowUpRight width={16} height={16} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
