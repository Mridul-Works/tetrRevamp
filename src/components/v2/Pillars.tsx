import { v2Pillars } from "@/data/v2";

/** Three numbered pillars on Tetr's forest green, each one hard rule apart. */
export default function Pillars() {
  return (
    <section className="grain relative mt-24 bg-forest text-cream md:mt-32">
      <div className="container-x py-16 md:py-24">
        <ol className="border-t border-snow/15">
          {v2Pillars.map((p) => (
            <li key={p.n} className="grid gap-4 border-b border-snow/15 py-8 md:grid-cols-12 md:items-center">
              <span className="v2-mono self-start text-mint md:col-span-2">{p.n}</span>
              <h3 className="v2-display text-[clamp(48px,8vw,128px)] text-snow md:col-span-5">{p.title}</h3>
              <p className="max-w-[44ch] text-[15px] leading-[1.55] text-cream/70 md:col-span-5">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
