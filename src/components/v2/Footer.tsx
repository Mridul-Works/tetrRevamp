import { v2Footer, v2Nav } from "@/data/v2";

export default function Footer() {
  return (
    <footer className="container-x py-10">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 md:col-span-6">
          <p className="v2-display text-[clamp(64px,10vw,160px)] leading-[0.85]">{v2Nav.mark}</p>
          <div className="flex flex-col gap-2">
            <a href={v2Footer.contact.href} target="_blank" rel="noreferrer" className="v2-mono w-fit underline-offset-4 hover:underline">
              {v2Footer.contact.label} ↗
            </a>
            <a href={v2Footer.back.href} className="v2-mono v2-mute w-fit underline-offset-4 hover:underline">
              ← {v2Footer.back.label}
            </a>
          </div>
        </div>
        <ul className="flex flex-col gap-2 md:col-span-3">
          {v2Footer.nav.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="v2-mono hover:opacity-60">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2 md:col-span-3">
          {v2Footer.social.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" className="v2-mono hover:opacity-60">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="v2-mono v2-mute mt-12 border-t v2-rule pt-5">{v2Footer.copy}</p>
    </footer>
  );
}
