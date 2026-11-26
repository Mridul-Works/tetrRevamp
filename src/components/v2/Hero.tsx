import { QS_BADGE, v2Hero } from "@/data/v2";
import { InlineCountdown } from "./Countdown";
import LeadForm from "./LeadForm";

/** Lead hero: the Tetr proposition and proof on the left, the form above the fold on the right. */
export default function Hero() {
  return (
    <section id="top" className="container-x pt-24 pb-14 md:pt-32 md:pb-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-7 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-forest px-3 py-2">
              <img src={QS_BADGE} alt={v2Hero.badgeAlt} className="h-[40px] w-auto" />
            </div>
            <p className="v2-mono">{v2Hero.eyebrow}</p>
          </div>

          <h1 className="v2-display text-[clamp(56px,8.2vw,124px)] leading-[0.88] tracking-[-0.01em]">
            {v2Hero.title.a}
            <br />
            <span className="accent normal-case text-deep" style={{ fontSize: "0.78em" }}>
              {v2Hero.title.accent}
            </span>
            <br />
            {v2Hero.title.b}
          </h1>

          <p className="max-w-[52ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] v2-mute">{v2Hero.body}</p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={v2Hero.cta.href}
              className="v2-mono inline-flex h-13 items-center bg-[var(--v2-ink)] px-7 text-[12.5px] font-semibold text-[var(--v2-paper)] transition-colors hover:bg-gold hover:text-[var(--v2-ink)]"
            >
              {v2Hero.cta.label}
            </a>
            <a href={v2Hero.secondary.href} target="_blank" rel="noreferrer" className="v2-mono inline-flex h-13 items-center border v2-rule px-6 text-[12.5px] transition-colors hover:border-[var(--v2-ink)]">
              {v2Hero.secondary.label}
            </a>
            <InlineCountdown to={v2Hero.deadline} label={v2Hero.deadlineLabel} className="ml-1" />
          </div>

          <ul className="grid grid-cols-3 border-t v2-rule">
            {v2Hero.proof.map((p, i) => (
              <li key={p.label} className={i > 0 ? "border-l v2-rule py-5 pl-5" : "py-5"}>
                <p className="v2-display text-[clamp(32px,3.6vw,56px)]">{p.value}</p>
                <p className="v2-mono v2-mute mt-1">{p.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <div id="lead" className="scroll-mt-20 lg:col-span-5" data-leadform>
          <LeadForm placement="hero" className="lg:sticky lg:top-24" />
        </div>
      </div>

      {/* filmstrip: students on the route */}
      <div className="mt-14 border-y-2 border-forest py-2">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {v2Hero.film.map((src, i) => (
            <figure key={src} className={i >= 3 ? "hidden aspect-[4/3] overflow-hidden bg-forest md:block" : "aspect-[4/3] overflow-hidden bg-forest"}>
              <img src={src} alt="" loading={i === 0 ? "eager" : "lazy"} className="size-full object-cover transition-transform duration-700 hover:scale-105" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
