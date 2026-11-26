import { v2MidCta } from "@/data/v2";

/** Mid-page catch for visitors who won't read to the end: one line, one button, one WhatsApp link. */
export default function MidCta() {
  return (
    <section className="container-x pt-20 md:pt-28">
      <div className="grid gap-6 border-y v2-rule py-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-8">
          <p className="text-[clamp(26px,3.4vw,48px)] font-semibold leading-[1.05] tracking-[-0.025em]">
            {v2MidCta.line} <span className="accent text-deep">{v2MidCta.accent}</span>
          </p>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-[1.55] v2-mute">{v2MidCta.body}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
          <a href={v2MidCta.cta.href} className="v2-mono inline-flex h-12 items-center bg-gold px-6 font-semibold text-gold-ink transition-colors hover:bg-[#ffd75e]">
            {v2MidCta.cta.label}
          </a>
          <a href={v2MidCta.secondary.href} target="_blank" rel="noreferrer" className="v2-mono inline-flex h-12 items-center border v2-rule px-5 transition-colors hover:border-[var(--v2-ink)]">
            {v2MidCta.secondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
