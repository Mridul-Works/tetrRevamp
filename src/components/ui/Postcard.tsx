"use client";

import Image from "next/image";
import Postmark from "./Postmark";
import { cn } from "@/lib/cn";

type Stamp = { top: string; big: string; bottom: string };

type Props = {
  image: string;
  alt: string;
  /** Display line under the photo, wrapped in curly quotes when `quoted` is on. */
  quote: string;
  quoted?: boolean;
  /** Mono, uppercase label on the left of the byline row. */
  by: string;
  /** Bold text on the right of the byline row. */
  cta?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  stamp?: Stamp;
  mark?: { place: string; sub?: string };
  /** Resting tilt in degrees and vertical offset in px; the card straightens and lifts on hover. */
  tilt?: number;
  lift?: number;
  sizes?: string;
  /** Receives the photo wrapper, for parallax. */
  imgRef?: React.Ref<HTMLDivElement>;
  className?: string;
};

const defaultStamp: Stamp = { top: "TETR", big: "7", bottom: "COUNTRIES" };

/**
 * A creator or student reel styled as a physical postcard: paper card, 4:5 photo well,
 * perforated postage stamp, round postmark, a display quote and a byline row.
 * The whole card is the link (or button) when `href`/`onClick` is given.
 */
export default function Postcard({
  image,
  alt,
  quote,
  quoted = true,
  by,
  cta,
  href,
  onClick,
  stamp = defaultStamp,
  mark = { place: "Tetr Post", sub: "2026" },
  tilt = 0,
  lift = 0,
  sizes = "300px",
  imgRef,
  className,
}: Props) {
  const style = { "--tilt": `${tilt}deg`, "--lift": `${lift}px` } as React.CSSProperties;
  const cls = cn("pc group block w-[260px] rounded-[6px] bg-paper p-3 pb-4 text-left text-ink sm:w-[300px]", className);

  const body = (
    <>
      <div ref={imgRef} className="pc__img relative aspect-[4/5] overflow-hidden rounded-[3px] bg-cream">
        <Image src={image} alt={alt} fill sizes={sizes} draggable={false} className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
      </div>

      {/* postage stamp: dotted outline for the perforated edge, deep green face, gold foil text */}
      <span aria-hidden className="pc__stamp absolute right-[22px] top-[22px] grid h-[70px] w-[58px] place-items-center rounded-[2px] bg-paper p-[5px] outline-[3px] outline-dotted outline-paper rotate-[4deg] shadow-[0_6px_14px_rgba(0,0,0,.3)]">
        <span className="grid size-full place-content-center gap-px bg-deep text-center leading-none text-gold">
          <small className="font-mono text-[8px] font-semibold tracking-[0.14em]">{stamp.top}</small>
          <span className="font-serif text-[24px] font-bold leading-none">{stamp.big}</span>
          <small className="font-mono text-[7.5px] font-semibold tracking-[0.1em]">{stamp.bottom}</small>
        </span>
      </span>

      {/* round postmark cancelling the stamp */}
      <Postmark place={mark.place} sub={mark.sub} rim="TETR COLLEGE OF BUSINESS · POSTED · " color="var(--color-deep)" tilt={-14} className="pointer-events-none absolute right-[-6px] top-[54px] w-[152px] opacity-80 mix-blend-multiply" />

      <div className="pt-[14px] px-1">
        <p className="font-serif text-[21px] italic leading-[1.15] text-ink">{quoted ? `“${quote}”` : quote}</p>
        <p className="mt-3 flex items-baseline justify-between gap-3 border-t border-dashed border-ink/25 pt-3">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-byline-light">{by}</span>
          {cta && <b className="whitespace-nowrap text-[13.5px] font-semibold text-deep">{cta}</b>}
        </p>
      </div>
    </>
  );

  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {body}
      </a>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cls} style={style}>
        {body}
      </button>
    );
  return (
    <div className={cls} style={style}>
      {body}
    </div>
  );
}
