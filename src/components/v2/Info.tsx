import { v2Info } from "@/data/v2";

export default function Info() {
  return (
    <section id="visit" className="container-x scroll-mt-16 pt-24 md:pt-32">
      <h2 className="v2-display max-w-[14ch] text-[clamp(44px,6.5vw,104px)]">{v2Info.title}</h2>
      <div className="mt-10 grid border-t v2-rule md:grid-cols-3">
        {v2Info.cards.map((c, i) => (
          <article key={c.title} className={i > 0 ? "flex flex-col gap-6 border-t v2-rule py-8 md:border-t-0 md:border-l md:px-8" : "flex flex-col gap-6 py-8 md:pr-8"}>
            <div className="flex items-center justify-between">
              <h3 className="v2-display text-[32px]">{c.title}</h3>
              <span className="v2-mono v2-mute">0{i + 1}</span>
            </div>
            <p className="text-[15px] leading-[1.6] v2-mute">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
