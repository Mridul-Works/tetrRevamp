import { cn } from "@/lib/cn";
import { v2Tickets, type TierStatus } from "@/data/v2";

const statusTone: Record<TierStatus, string> = {
  Open: "bg-mint text-ink",
  "Closing soon": "bg-gold text-gold-ink",
  Closed: "bg-[var(--v2-ink)]/10 v2-mute",
};

/** Programs as a row of tear-off tickets: notched edges, perforation line, status pill. */
export default function Tickets() {
  return (
    <section id="programs" className="container-x scroll-mt-16 pt-24 md:pt-32">
      <div className="grid gap-6 border-b v2-rule pb-8 md:grid-cols-12">
        <p className="v2-mono v2-mute md:col-span-3">{v2Tickets.eyebrow}</p>
        <div className="md:col-span-9">
          <p className="v2-mono mb-3">{v2Tickets.kicker}</p>
          <h3 className="v2-display text-[clamp(40px,5.5vw,88px)]">{v2Tickets.title}</h3>
        </div>
      </div>

      <div className="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-4">
        {v2Tickets.tiers.map((t) => {
          const closed = t.status === "Closed";
          return (
            <a
              key={t.name}
              href={t.href}
              className={cn(
                "v2-ticket group flex flex-col bg-[var(--v2-ink)] text-[var(--v2-paper)] transition-transform duration-300",
                closed ? "opacity-70" : "hover:-translate-y-1",
              )}
            >
              <div className="flex flex-col gap-6 px-7 pt-7 pb-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="v2-display text-[34px] leading-none">{t.name}</p>
                    <p className="v2-mono mt-2 text-[var(--v2-paper)]/60">{t.blurb}</p>
                  </div>
                  <span className={cn("v2-mono shrink-0 px-2 py-1 text-[10px]", statusTone[t.status])}>{t.status}</span>
                </div>
                <div>
                  <p className="v2-display text-[30px] leading-none">{t.price}</p>
                  <p className="v2-mono mt-1 text-[var(--v2-paper)]/60">{t.priceNote}</p>
                </div>
              </div>
              <div className="v2-perf mx-3 opacity-60 [background-image:linear-gradient(to_right,rgb(246_248_244/0.5)_55%,transparent_45%)]" />
              <ul className="flex flex-1 flex-col gap-2 px-7 pt-6 pb-7 text-[13px] leading-[1.4]">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden className="text-gold">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-[var(--v2-paper)]/15 px-7 py-4">
                <span className="v2-mono">{closed ? "Join the waitlist" : "Get fee & scholarship details"}</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="grid gap-4 border-t v2-rule py-6 md:grid-cols-12">
        <p className="v2-mono md:col-span-5">{v2Tickets.feeNote}</p>
        <ul className="v2-mono v2-mute flex flex-col gap-1.5 md:col-span-7">
          {v2Tickets.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
