import Counter from "@/components/ui/Counter";
import { v2LastYear } from "@/data/v2";

export default function LastYear() {
  return (
    <section id="outcomes" className="container-x scroll-mt-16 pt-24 md:pt-32">
      <div className="grid gap-8 border-t v2-rule pt-8 md:grid-cols-12">
        <p className="v2-mono v2-mute md:col-span-3">{v2LastYear.eyebrow}</p>
        <div className="md:col-span-9">
          <p className="v2-mono mb-5 text-deep">{v2LastYear.quoteHead}</p>
          <blockquote className="text-[clamp(26px,3.4vw,48px)] font-medium leading-[1.12] tracking-[-0.02em]">
            “A business school where the final exam is <span className="accent text-deep">a P&amp;L.</span> Tetr students sold more in their first term than most MBA case studies describe.”
          </blockquote>
        </div>
      </div>
      <div className="mt-12 grid border-t v2-rule md:grid-cols-2">
        {v2LastYear.stats.map((s, i) => (
          <div key={s.label} className={i > 0 ? "border-t v2-rule py-8 md:border-t-0 md:border-l md:pl-8" : "py-8"}>
            <Counter value={s.value} className="v2-display block text-[clamp(72px,11vw,176px)]" />
            <p className="v2-mono mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
