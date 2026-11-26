import { v2LeadSection } from "@/data/v2";
import LeadForm from "./LeadForm";

/** The form, one scroll below the hero: three reasons on the left, the form on the right. */
export default function LeadSection() {
  return (
    <section id="lead" className="container-x scroll-mt-20 pt-20 pb-20 md:pt-28 md:pb-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-6">
          <p className="v2-mono v2-mute">{v2LeadSection.eyebrow}</p>
          <h2 className="v2-display text-[clamp(40px,5vw,84px)]">{v2LeadSection.title}</h2>
          <ul className="border-t v2-rule">
            {v2LeadSection.points.map((pt, i) => (
              <li key={pt} className="flex items-baseline gap-5 border-b v2-rule py-4">
                <span className="v2-mono v2-mute">0{i + 1}</span>
                <span className="text-[17px] font-medium tracking-[-0.01em]">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6" data-leadform>
          <LeadForm placement="hero" />
        </div>
      </div>
    </section>
  );
}
