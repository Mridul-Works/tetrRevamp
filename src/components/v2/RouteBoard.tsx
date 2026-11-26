import Postmark from "@/components/ui/Postmark";
import { v2Route } from "@/data/v2";

/**
 * The schedule board: one column per term. Each column opens with a postcard of what the
 * country is famous for, stamped with its base-camp city, then lists the term's visits.
 */
export default function RouteBoard() {
  return (
    <section id="route" className="scroll-mt-16 pt-24 pb-10 md:pt-32">
      <div className="container-x flex flex-col gap-4 border-b v2-rule pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="v2-display text-[clamp(44px,7vw,112px)]">{v2Route.title}</h2>
          <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.5] v2-mute">{v2Route.sub}</p>
        </div>
        <p className="v2-mono v2-mute whitespace-nowrap">{v2Route.eyebrow}</p>
      </div>

      <div className="no-scrollbar flex overflow-x-auto">
        {v2Route.terms.map((t) => (
          <div key={t.term} className="flex w-[300px] shrink-0 flex-col border-r v2-rule sm:w-[340px]">
            {/* postcard: the landmark, tinted with the country's accent, stamped with the city */}
            <div className="relative aspect-[4/3] overflow-hidden bg-forest">
              <img src={t.landmark.image} alt={t.landmark.title} loading="lazy" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 mix-blend-multiply opacity-35" style={{ background: t.accent }} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <span className="v2-mono absolute top-3 left-4 text-snow/80">Term {t.term}</span>
              <Postmark place={t.city} sub={t.landmark.title} color="var(--color-cream)" tilt={-7} className="absolute -top-1 right-0 w-[150px]" />
              <div className="absolute inset-x-4 bottom-3">
                <p className="v2-display text-[44px] leading-none text-snow">{t.name}</p>
                <p className="v2-mono mt-1 text-gold">{t.tag}</p>
              </div>
            </div>

            <div className="border-b v2-rule px-5 py-3">
              <p className="v2-mono v2-mute">Famous for</p>
              <p className="mt-1 text-[13.5px] leading-[1.45]">
                {t.famous.map((f, i) => (
                  <span key={f}>
                    {i > 0 && <span className="v2-mute"> · </span>}
                    {f}
                  </span>
                ))}
              </p>
            </div>

            <ul>
              {t.sets.map((s) => (
                <li key={s.time} className="grid grid-cols-[72px_1fr_auto] gap-3 border-b v2-rule px-5 py-4">
                  <span className="v2-mono v2-mute tabular-nums">{s.time}</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-medium leading-tight">{s.act}</span>
                    <span className="v2-mono v2-mute">{s.stage}</span>
                  </div>
                  <span
                    className="v2-mono self-start border px-1.5 py-0.5 text-[10px]"
                    style={s.tag === "Earn" ? { background: "var(--color-gold)", borderColor: "var(--color-gold)", color: "var(--color-gold-ink)" } : undefined}
                  >
                    {s.tag}
                  </span>
                </li>
              ))}
            </ul>
            <p className="px-5 py-5 text-[13px] leading-[1.5] v2-mute">{t.build}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
