import { v2Closing } from "@/data/v2";
import { BigCountdown } from "./Countdown";
import LeadForm from "./LeadForm";

export default function Closing() {
  return (
    <section className="pt-24 md:pt-32">
      <div className="container-x">
        <div className="grid gap-10 border-t v2-rule pt-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <h2 className="v2-display text-[clamp(48px,7vw,120px)]">{v2Closing.title}</h2>
            <p className="mt-3 text-[clamp(20px,2.2vw,30px)] font-medium tracking-[-0.01em] v2-mute">
              The next round <span className="accent text-deep">won’t wait.</span>
            </p>
            <p className="v2-mono v2-mute mt-8">{v2Closing.line}</p>
            <a
              href={v2Closing.ticket.href}
              className="v2-ticket group mt-4 inline-flex items-stretch bg-gold text-gold-ink transition-colors hover:bg-[var(--v2-ink)] hover:text-[var(--v2-paper)]"
            >
              <span className="v2-mono flex items-center px-7 py-5 text-[12px] font-semibold">{v2Closing.ticket.label}</span>
              <span className="w-px self-stretch bg-current opacity-25" aria-hidden />
              <span className="flex flex-col justify-center px-6 py-4">
                <span className="v2-display text-[18px] leading-none tabular-nums">{v2Closing.ticket.no}</span>
                <span className="v2-mono mt-1 opacity-60">{v2Closing.ticket.tail}</span>
              </span>
            </a>
            <p className="mt-4">
              <a href={v2Closing.partner.href} target="_blank" rel="noreferrer" className="v2-mono underline-offset-4 hover:underline">
                {v2Closing.partner.label}
              </a>
            </p>
          </div>
          <div className="lg:col-span-6" data-leadform>
            <LeadForm compact placement="closing" />
          </div>
        </div>
      </div>

      {/* countdown wall on forest green, gold numerals */}
      <div className="grain relative mt-20 bg-forest text-cream">
        <p className="container-x v2-mono pt-8 pb-2 text-mint">{v2Closing.countdownLabel}</p>
        <BigCountdown to={v2Closing.deadline} dark />
      </div>
    </section>
  );
}
