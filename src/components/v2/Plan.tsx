import { v2Plan } from "@/data/v2";

/** Site-plan block: a numbered legend with a landmark thumb per stop, a dark plate with the route, stats under. */
export default function Plan() {
  const n = v2Plan.legend.length;
  const pt = (i: number) => ({ x: 18 + (i * 124) / (n - 1), y: 52 + Math.sin(i * 1.9) * 24 });
  return (
    <section id="plan" className="container-x scroll-mt-16 pt-24 md:pt-32">
      <div className="grid gap-6 border-b v2-rule pb-8 md:grid-cols-12">
        <p className="v2-mono v2-mute md:col-span-3">{v2Plan.eyebrow}</p>
        <div className="md:col-span-9">
          <p className="v2-mono mb-3">{v2Plan.kicker}</p>
          <h3 className="v2-display text-[clamp(40px,5.5vw,88px)]">{v2Plan.title}</h3>
        </div>
      </div>

      <div className="grid gap-8 py-10 md:grid-cols-12">
        <ol className="flex flex-col md:col-span-4">
          {v2Plan.legend.map((l) => (
            <li key={l.n} className="flex items-center gap-4 border-b v2-rule py-2.5">
              <span className="v2-mono grid size-7 shrink-0 place-items-center border v2-rule">{l.n}</span>
              <img src={l.image} alt="" loading="lazy" className="size-11 shrink-0 object-cover" style={{ boxShadow: `inset 0 0 0 2px ${l.accent}` }} />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium">{l.label}</p>
                <p className="v2-mono v2-mute truncate">{l.famous}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* the "map": a forest plate with the route as a stepped polyline and pins in each country's colour */}
        <div className="grain relative aspect-[16/10] overflow-hidden bg-forest text-cream md:col-span-8">
          <div className="grid-lines absolute inset-0" />
          <svg viewBox="0 0 160 100" className="absolute inset-0 size-full" aria-hidden>
            <polyline
              points={v2Plan.legend.map((_, i) => `${pt(i).x},${pt(i).y}`).join(" ")}
              fill="none"
              stroke="var(--color-mint)"
              strokeOpacity="0.5"
              strokeWidth="0.5"
              strokeDasharray="1.5 1.5"
            />
            {v2Plan.legend.map((l, i) => {
              const { x, y } = pt(i);
              return (
                <g key={l.n}>
                  <circle cx={x} cy={y} r="6" fill={l.accent} fillOpacity="0.25" />
                  <circle cx={x} cy={y} r="4" fill={l.accent} />
                  <text x={x} y={y + 1.4} textAnchor="middle" fontSize="4" fontFamily="var(--font-mono)" fill="var(--color-ink)" fontWeight="600">
                    {l.n}
                  </text>
                  <text
                    x={x}
                    y={i === 1 || i === 3 ? y - 7 : y + 10}
                    textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                    fontSize="3"
                    fontFamily="var(--font-mono)"
                    fill="currentColor"
                    fillOpacity="0.8"
                    letterSpacing="0.3"
                  >
                    {l.famous.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="v2-mono absolute top-4 left-4 text-mint">Gate A · New Delhi</p>
          <p className="v2-mono absolute right-4 bottom-4 text-mint">Gate B · Madrid</p>
        </div>
      </div>

      <div className="grid border-t v2-rule md:grid-cols-3">
        {v2Plan.stats.map((s, i) => (
          <div key={s.label} className={i > 0 ? "border-t v2-rule py-8 md:border-t-0 md:border-l md:pl-8" : "py-8"}>
            <p className="v2-display text-[clamp(56px,7vw,112px)]">{s.value}</p>
            <p className="v2-mono mt-2">{s.label}</p>
            <p className="v2-mono v2-mute mt-1">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
