import { LOGO, QS_BADGE, footer } from "@/data/content";
import { ArrowUpRight, Instagram, Linkedin, Youtube } from "@/components/ui/icons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0a2a1c] pt-16 text-[#e8efe9]">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.1fr_0.7fr_0.8fr_1fr_1.2fr_1.3fr]">
          <div className="col-span-2 flex items-end justify-between gap-4 sm:block lg:col-span-1">
            <a href="https://tetr.com" target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO} alt="TETR College of Business" className="w-[130px] md:w-[170px]" />
            </a>
            <a
              href={footer.apply.href}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded bg-gold px-5 py-3.5 text-[14px] font-bold tracking-[0.05em] text-gold-ink transition-colors hover:bg-[#ffd75e] sm:mt-10"
            >
              {footer.apply.label}
              <ArrowUpRight width={16} height={16} />
            </a>
          </div>

          {footer.columns.map((col) => (
            <nav key={col.label} aria-label={col.label} className="flex flex-col gap-5">
              {col.links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener" className="w-fit text-[15px] transition-colors hover:text-mint">
                  {l.label}
                </a>
              ))}
            </nav>
          ))}

          <div className="col-span-2 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QS_BADGE} alt="QS Gold Winner badge" className="w-[220px] md:w-[260px]" />
            <div className="mt-6 flex items-center gap-4">
              <a href={footer.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="transition-colors hover:text-mint">
                <Instagram width={22} height={22} />
              </a>
              <a href={footer.social.youtube} target="_blank" rel="noopener" aria-label="YouTube" className="transition-colors hover:text-mint">
                <Youtube width={22} height={22} />
              </a>
              <a href={footer.social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="transition-colors hover:text-mint">
                <Linkedin width={22} height={22} />
              </a>
              <span className="text-[14px]">
                Email:{" "}
                <a href={`mailto:${footer.email}`} className="hover:text-mint">
                  {footer.email}
                </a>
              </span>
            </div>
            <div className="mt-5 flex gap-2.5">
              {footer.stores.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.badge} alt={s.label} className="h-[42px] w-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-12 h-[3px] rounded-full opacity-85"
          style={{
            background:
              "linear-gradient(90deg,#7c3aed 0%,#ffffff 8%,#22d3ee 16%,#0ea5e9 24%,#1e3a8a 32%,#ffffff 42%,#10b981 52%,#ffffff 60%,#f59e0b 70%,#ffffff 78%,#ef4444 86%,#ec4899 94%,#10b981 100%)",
          }}
        />
        <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-3 text-[13px] tracking-[0.08em]">
          {footer.legal.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener" className="transition-colors hover:text-mint">
              {l.label}
            </a>
          ))}
        </div>
        <p className="pb-8 pt-4 text-center text-[12px] text-[#cfd8d2]">{footer.copyright}</p>
      </div>
    </footer>
  );
}
