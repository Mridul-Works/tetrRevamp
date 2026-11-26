"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { chapters } from "@/data/content";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Country ephemera for the Outcomes chapters: an engraved postage stamp with a perforated
 * edge, a postmark cancelling it, and a thick gradient ribbon looping behind. The ribbon
 * draws with scroll (scrubbed); the stamp slaps down and its engraving inks in once.
 */

/** ink: main engraving line · soft: faint lines · a / b: two accents · dash: dotted detail (fades, never draws) */
type Tone = "ink" | "soft" | "a" | "b" | "dash";
type Stroke = [d: string, tone?: Tone];
type Doodle = {
  greeting: string;
  /** Stamp colours: the paper it is printed on, the engraving ink, and what the two accents map to */
  field: string;
  art: string;
  a: string;
  b: string;
  strokes: Stroke[];
};

const GROUND: Stroke = ["M12 150 C 80 147, 220 153, 288 149", "soft"];

/** Landmarks drawn on a 300×170 canvas; they are scaled to half inside the stamp. */
const DOODLES: Record<string, Doodle> = {
  Dubai: {
    greeting: "marhaba",
    field: "var(--color-gold)",
    art: "var(--color-gold-ink)",
    a: "var(--color-deep)",
    b: "var(--color-snow)",
    strokes: [
      GROUND,
      // Burj Khalifa
      ["M132 150 L136 110 L140 108 L142 80 L145 78 L147 45 L149 43 L150 12 L151 43 L153 45 L155 78 L158 80 L160 108 L164 110 L168 150"],
      ["M150 108 V150 M146 80 V108 M154 80 V108", "soft"],
      // Burj Al Arab sail
      ["M70 150 V58 C 96 74, 104 114, 97 150"],
      ["M70 58 L65 50 M70 84 C 80 90, 88 98, 92 106 M70 112 C 80 116, 88 122, 94 130", "soft"],
      // sun
      ["M235 29 A16 16 0 1 1 234.9 29 Z", "b"],
      ["M235 6 V12 M258 45 H264 M206 45 H212 M251 29 L255 25 M219 29 L215 25", "b"],
      // dunes + palm
      ["M190 150 C 215 128, 240 128, 262 142 C 272 136, 282 136, 292 142", "soft"],
      ["M214 150 C 216 130, 212 115, 216 100"],
      ["M216 100 C 206 94, 198 96, 192 102 M216 100 C 226 92, 236 94, 242 100 M216 100 C 212 90, 206 86, 198 86 M216 100 C 222 88, 230 84, 238 86", "a"],
      // birds
      ["M96 30 q5 -5 10 0 q5 -5 10 0 M112 18 q3 -3 6 0 q3 -3 6 0", "soft"],
    ],
  },
  India: {
    greeting: "namaste",
    field: "var(--color-deep)",
    art: "var(--color-snow)",
    a: "var(--color-mint)",
    b: "var(--color-gold)",
    strokes: [
      GROUND,
      // plinth + hall
      ["M95 150 V140 H205 V150"],
      ["M110 140 V95 H190 V140"],
      ["M140 140 V116 Q150 102 160 116 V140"],
      ["M118 132 V118 Q123 112 128 118 V132 M172 132 V118 Q177 112 182 118 V132", "soft"],
      // onion dome + finial
      ["M122 95 C 116 70, 135 56, 150 48 C 165 56, 184 70, 178 95"],
      ["M150 48 V34", "b"],
      ["M150 26 A3 3 0 1 1 149.9 26 Z", "b"],
      ["M113 95 Q118 82 124 95 M176 95 Q182 82 187 95", "soft"],
      // minarets
      ["M78 150 L80 72 H84 L86 150 M214 150 L216 72 H220 L222 150"],
      ["M77 72 Q82 60 87 72 M213 72 Q218 60 223 72"],
      ["M79 100 H85 M79 125 H85 M215 100 H221 M215 125 H221", "soft"],
      // reflecting pool
      ["M108 158 H192", "dash"],
      // kite
      ["M262 18 L274 34 L262 52 L250 34 Z", "b"],
      ["M262 18 V52 M250 34 H274", "b"],
      ["M262 52 C 256 80, 272 100, 246 128", "dash"],
    ],
  },
  China: {
    greeting: "ni hao",
    field: "var(--color-mint)",
    art: "var(--color-ink)",
    a: "var(--color-snow)",
    b: "var(--color-deep)",
    strokes: [
      GROUND,
      // distant hills
      ["M12 150 L40 106 L58 128 L78 98 L102 150", "soft"],
      // pagoda
      ["M128 150 V128 H172 V150"],
      ["M108 130 C 120 128, 126 124, 132 118 H168 C 174 124, 180 128, 192 130"],
      ["M134 118 V100 H166 V118"],
      ["M116 102 C 126 100, 132 96, 138 90 H162 C 168 96, 174 100, 184 102"],
      ["M140 90 V74 H160 V90"],
      ["M124 76 C 132 74, 138 70, 143 64 H157 C 162 70, 168 74, 176 76"],
      ["M150 64 V42", "b"],
      ["M150 49 A3 3 0 1 1 149.9 49 Z", "b"],
      ["M144 150 V139 Q150 132 156 139 V150", "soft"],
      // lantern
      ["M70 8 V38", "soft"],
      ["M58 50 C 58 38, 82 38, 82 50 C 82 62, 58 62, 58 50 Z", "b"],
      ["M64 38 H76 M64 62 H76 M70 39 V61 M63 41 C 60 46, 60 54, 63 59 M77 41 C 80 46, 80 54, 77 59", "b"],
      ["M70 62 V76", "a"],
      // great wall
      ["M200 150 C 215 135, 230 125, 245 128 C 260 131, 272 118, 290 112"],
      ["M200 142 C 215 127, 230 117, 245 120 C 260 123, 272 110, 290 104"],
      ["M238 121 V108 H252 V121 M238 108 V104 H242 V108 M244 108 V104 H248 V108 M250 108 V104 H252", "a"],
    ],
  },
  Ghana: {
    greeting: "akwaaba",
    field: "var(--color-cream)",
    art: "var(--color-ink)",
    a: "var(--color-deep)",
    b: "var(--color-gold)",
    strokes: [
      GROUND,
      // Black Star Gate
      ["M100 80 H200 V70 H100 Z"],
      ["M105 150 V80 M195 150 V80"],
      ["M125 150 V102 Q150 84 175 102 V150"],
      ["M105 92 H125 M175 92 H195", "soft"],
      ["M144 70 L147 60 H153 L156 70", "soft"],
      ["M150 30 L153.8 40.7 L165.2 41.1 L156.2 48 L159.4 58.9 L150 52.5 L140.6 58.9 L143.8 48 L134.8 41.1 L146.2 40.7 Z", "b"],
      // kente swatch
      ["M28 100 H80 V146 H28 Z", "b"],
      ["M28 115 H80 M28 131 H80 M45 100 V146 M63 100 V146", "b"],
      ["M28 115 L45 100 M45 131 L63 115 M63 146 L80 131 M45 115 L63 100", "a"],
      // djembe
      ["M225 100 C 225 94, 265 94, 265 100 C 265 106, 225 106, 225 100 Z"],
      ["M225 100 C 225 115, 240 120, 238 128 C 236 136, 230 142, 232 150 H258 C 260 142, 254 136, 252 128 C 250 120, 265 115, 265 100"],
      ["M228 104 L236 120 L244 106 L252 120 L262 104", "a"],
      ["M238 128 H252", "soft"],
    ],
  },
  USA: {
    greeting: "howdy",
    field: "var(--color-ink)",
    art: "var(--color-mint)",
    a: "var(--color-snow)",
    b: "var(--color-gold)",
    strokes: [
      GROUND,
      // Statue of Liberty
      ["M75 150 V125 H115 V150"],
      ["M80 125 V115 H110 V125", "soft"],
      ["M86 115 C 86 95, 88 80, 92 70 H102 C 106 80, 106 95, 104 115"],
      ["M97 56 A6 6 0 1 1 96.9 56 Z"],
      ["M91 57 L86 50 M95 55 L94 47 M99 55 L101 47 M103 57 L108 50", "a"],
      ["M102 72 L110 40 M88 85 L83 93 L90 97"],
      ["M106 40 H114 L112 34 H108 Z"],
      ["M110 34 C 105 28, 110 24, 110 18 C 113 24, 116 28, 110 34", "b"],
      // skyline
      ["M200 150 V80 H214 V64 H220 V40 L222 26 L224 40 V64 H230 V80 H244 V150"],
      ["M175 150 V100 H195 V150 M250 150 V110 H274 V150", "soft"],
      ["M207 92 V100 M214 92 V100 M221 92 V100 M228 92 V100 M235 92 V100 M207 112 V120 M214 112 V120 M221 112 V120 M228 112 V120 M235 112 V120", "dash"],
      // stars
      ["M155 32 L156.9 37.4 L162.6 37.5 L158 41 L159.7 46.5 L155 43.2 L150.3 46.5 L152 41 L147.4 37.5 L153.1 37.4 Z", "b"],
      ["M178 16 V26 M173 21 H183 M136 60 V66 M133 63 H139", "b"],
    ],
  },
};

/* Stamp geometry (user units). Perforation pitch divides both sides so the holes meet at the corners. */
const SW = 168;
const SH = 210;
const PITCH = 14;
const HOLE = 5;
const holes: [number, number][] = [];
for (let x = 0; x <= SW; x += PITCH) holes.push([x, 0], [x, SH]);
for (let y = PITCH; y < SH; y += PITCH) holes.push([0, y], [SW, y]);

/** A postage stamp, postmark and ribbon for a chapter country. Hidden where there is no stamp for it. */
export default function CountryDoodle({ country, className }: { country: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const doodle = DOODLES[country];
  const index = chapters.findIndex((c) => c.country === country);
  const chapter = chapters[index];
  const num = String(Math.max(0, index) + 1).padStart(2, "0");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The ribbon draws with scroll, like the reference's ribbons.
        gsap.fromTo(
          el.querySelector("[data-ribbon]"),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 40%", scrub: 0.4 },
          },
        );
        // The stamp slaps down once, its engraving inks in, then the postmark cancels it.
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%", once: true } });
        tl.fromTo(
          el.querySelector("[data-stamp]"),
          { autoAlpha: 0, scale: 1.22, rotation: -17, y: 26 },
          { autoAlpha: 1, scale: 1, rotation: -5, y: 0, duration: 0.7, ease: "power3.out" },
        )
          .fromTo(
            el.querySelectorAll("[data-draw]"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.045 },
            0.25,
          )
          .fromTo(el.querySelectorAll("[data-fade]"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 }, 0.9)
          .fromTo(
            el.querySelector("[data-postmark]"),
            { autoAlpha: 0, scale: 1.7, rotation: -42 },
            { autoAlpha: 1, scale: 1, rotation: -14, duration: 0.38, ease: "power4.out" },
            0.85,
          );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [country] },
  );

  if (!doodle || !chapter) return null;

  const tone: Record<Tone, string> = {
    ink: doodle.art,
    soft: doodle.art,
    a: doodle.a,
    b: doodle.b,
    dash: doodle.art,
  };
  const maskId = `stamp-${uid}`;
  const hatchId = `hatch-${uid}`;
  const gradId = `ribbon-${uid}`;
  const arcTop = `arc-top-${uid}`;
  const arcBottom = `arc-bottom-${uid}`;

  return (
    <div ref={root} aria-hidden className={cn("pointer-events-none relative aspect-[300/250] select-none", className)}>
      {/* ribbon: a thick gradient stroke looping behind the stamp */}
      {/* The canvas ends at the cluster's right edge, and the ink stays inside it, so nothing widens the page. */}
      <svg
        viewBox="0 0 339 380"
        fill="none"
        className="absolute -left-[13%] -top-[20%] z-0 w-[113%] overflow-visible"
        style={{ aspectRatio: "339 / 380" }}
      >
        <defs>
          <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="12" y1="322" x2="316" y2="200">
            <stop offset="0" stopColor="var(--color-deep)" />
            <stop offset="0.45" stopColor="var(--color-mint)" />
            <stop offset="1" stopColor="var(--color-gold)" />
          </linearGradient>
        </defs>
        {/* enters bottom-left under the postmark, passes behind the stamp, and loops over its top-right corner */}
        <path
          data-ribbon
          d="M 12 322 C 92 350, 145 255, 192 195 C 226 158, 240 110, 240 60 C 240 20, 282 14, 310 40 C 326 66, 330 138, 316 200"
          stroke={`url(#${gradId})`}
          strokeWidth={24}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
        />
      </svg>

      {/* stamp */}
      <div
        data-stamp
        className="absolute right-[12%] top-[2%] z-10 w-[58%] [filter:drop-shadow(0_14px_22px_rgba(8,18,14,.22))]"
        style={{ transform: "rotate(-5deg)" }}
      >
        <svg
          viewBox={`0 0 ${SW} ${SH}`}
          className="block h-auto w-full"
          fill="none"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <mask id={maskId}>
              <rect width={SW} height={SH} fill="#fff" />
              {holes.map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={HOLE} fill="#000" />
              ))}
            </mask>
            <pattern id={hatchId} width="3" height="3" patternUnits="userSpaceOnUse">
              <path d="M0 1.5 H3" stroke={doodle.art} strokeWidth={0.6} opacity={0.1} />
            </pattern>
          </defs>
          <g mask={`url(#${maskId})`}>
            {/* paper: a hairline of white around the printed field, like a real stamp margin */}
            <rect width={SW} height={SH} fill="var(--color-snow)" />
            <rect x="8" y="8" width={SW - 16} height={SH - 16} fill={doodle.field} />
            <rect x="8" y="8" width={SW - 16} height={SH - 16} fill={`url(#${hatchId})`} />
            <rect x="14" y="14" width={SW - 28} height={SH - 28} stroke={doodle.art} strokeWidth={0.8} opacity={0.6} />

            {/* title band */}
            <text
              x={SW / 2}
              y="36"
              textAnchor="middle"
              fill={doodle.art}
              className="font-serif"
              style={{ fontSize: 17, letterSpacing: "0.2em", fontWeight: 500 }}
            >
              {country.toUpperCase()}
            </text>
            <path d={`M26 44 H${SW - 26}`} stroke={doodle.art} strokeWidth={0.8} opacity={0.5} />

            {/* engraving */}
            <g transform="translate(9 54) scale(0.5)">
              {doodle.strokes.map(([d, t = "ink"], i) =>
                t === "dash" ? (
                  <path key={i} d={d} data-fade stroke={tone[t]} opacity={0.5} strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
                ) : (
                  <path
                    key={i}
                    d={d}
                    data-draw
                    pathLength={1}
                    strokeDasharray={1}
                    stroke={tone[t]}
                    opacity={t === "soft" ? 0.45 : 1}
                    vectorEffect="non-scaling-stroke"
                  />
                ),
              )}
            </g>

            {/* value band */}
            <path d={`M26 160 H${SW - 26}`} stroke={doodle.art} strokeWidth={0.8} opacity={0.5} />
            <text x="26" y="192" fill={doodle.art} className="font-serif italic" style={{ fontSize: 30 }}>
              {num}
            </text>
            <text
              x={SW - 26}
              y="178"
              textAnchor="end"
              fill={doodle.art}
              className="font-mono"
              style={{ fontSize: 8.5, letterSpacing: "0.22em" }}
            >
              TETR
            </text>
            <text
              x={SW - 26}
              y="191"
              textAnchor="end"
              fill={doodle.art}
              className="font-mono"
              style={{ fontSize: 7.5, letterSpacing: "0.16em" }}
              opacity={0.8}
            >
              {chapter.model.toUpperCase()}
            </text>
          </g>
        </svg>
      </div>

      {/* postmark: rings, curved text, and the wavy cancel lines that run across the stamp */}
      <svg
        data-postmark
        viewBox="0 0 230 120"
        fill="none"
        className="absolute left-[20%] top-[60%] z-20 w-[77%] overflow-visible mix-blend-multiply"
        style={{ transform: "rotate(-14deg)", color: "var(--color-ink)", opacity: 1 }}
        stroke="currentColor"
      >
        <defs>
          <path id={arcTop} d="M 18 60 A 42 42 0 0 1 102 60" />
          <path id={arcBottom} d="M 18 60 A 42 42 0 0 0 102 60" />
        </defs>
        <g opacity={0.66}>
          <circle cx="60" cy="60" r="52" strokeWidth={2.4} />
          <circle cx="60" cy="60" r="33" strokeWidth={1} strokeDasharray="2.5 3" />
          <text fill="currentColor" stroke="none" className="font-mono" style={{ fontSize: 9.5, letterSpacing: "0.22em", fontWeight: 600 }}>
            <textPath href={`#${arcTop}`} startOffset="50%" textAnchor="middle">
              TETR · {country.toUpperCase()}
            </textPath>
          </text>
          <text fill="currentColor" stroke="none" className="font-serif italic" style={{ fontSize: 13 }}>
            <textPath href={`#${arcBottom}`} startOffset="50%" textAnchor="middle">
              {doodle.greeting}
            </textPath>
          </text>
          <text x="60" y="58" textAnchor="middle" fill="currentColor" stroke="none" className="font-serif" style={{ fontSize: 24, fontWeight: 600 }}>
            {num}
          </text>
          <text x="60" y="71" textAnchor="middle" fill="currentColor" stroke="none" className="font-mono" style={{ fontSize: 6.5, letterSpacing: "0.2em" }}>
            CHAPTER
          </text>
          {/* cancel lines */}
          {[44, 54, 64, 74].map((y) => (
            <path
              key={y}
              d={`M118 ${y} q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0`}
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={0.85}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
