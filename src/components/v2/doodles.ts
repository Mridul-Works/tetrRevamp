import { DOODLES, type Stroke } from "@/components/ui/Doodle";

/*
 * Line doodles for every stop, on a 300×170 canvas. Five come from the engraved stamps
 * used on the main page; Argentina and Europe are drawn here in the same hand.
 */

const GROUND: Stroke = ["M12 150 C 80 147, 220 153, 288 149", "soft"];

const ARGENTINA: Stroke[] = [
  GROUND,
  // Obelisco
  ["M144 150 L148 42 L152 28 L156 42 L160 150"],
  ["M136 150 H168 M150 52 H154", "soft"],
  // Sol de Mayo
  ["M236 25 A15 15 0 1 1 235.9 25 Z", "b"],
  ["M236 16 V7 M236 64 V73 M212 40 H203 M260 40 H269 M219 23 L213 17 M253 23 L259 17 M219 57 L213 63 M253 57 L259 63", "b"],
  ["M230 37 h3 M239 37 h3 M230 45 q6 5 12 0", "soft"],
  // football
  ["M70 112 A16 16 0 1 1 69.9 112 Z"],
  ["M70 121 L77 126 L74 134 H66 L63 126 Z", "a"],
  ["M70 112 V121 M77 126 L85 123 M74 134 L79 141 M66 134 L61 141 M63 126 L55 123", "soft"],
  // goal at La Bombonera
  ["M196 150 V112 H272 V150"],
  ["M206 112 V150 M216 112 V150 M226 112 V150 M236 112 V150 M246 112 V150 M256 112 V150 M266 112 V150 M196 124 H272 M196 137 H272", "dash"],
  // tango: a bandoneon squeeze and two notes
  ["M92 70 q6 -8 12 0 q6 8 12 0 q6 -8 12 0", "soft"],
  ["M104 98 V80 l10 -3 V95", "a"],
  ["M104 98 a4 3 0 1 1 -8 0 a4 3 0 1 1 8 0 M114 95 a4 3 0 1 1 -8 0 a4 3 0 1 1 8 0", "a"],
  // pampas grass
  ["M20 150 q4 -14 2 -24 M26 150 q2 -10 8 -18 M284 150 q-2 -12 4 -20", "soft"],
];

const EUROPE: Stroke[] = [
  GROUND,
  // Puerta de Alcalá
  ["M56 150 V84 H154 V150"],
  ["M52 84 H158 M60 84 V76 H150 V84", "soft"],
  ["M68 150 V114 A9 9 0 0 1 86 114 V150 M94 150 V106 A11 11 0 0 1 116 106 V150 M124 150 V114 A9 9 0 0 1 142 114 V150"],
  ["M92 76 L105 62 L118 76", "a"],
  // Formula 1 car
  ["M180 140 L184 131 H202 L214 122 H246 L252 131 H280 L286 140"],
  ["M206 133 A8 8 0 1 1 205.9 133 Z M264 133 A8 8 0 1 1 263.9 133 Z"],
  ["M182 131 V121 H192 M280 136 H294", "a"],
  ["M226 122 A6 6 0 0 1 238 122", "b"],
  ["M150 126 H172 M156 135 H174 M146 143 H170", "dash"],
  // chequered flag
  ["M236 74 V20"],
  ["M236 22 H274 V48 H236"],
  ["M248.7 22 V48 M261.3 22 V48 M236 35 H274", "soft"],
  // sparkle
  ["M196 40 V52 M190 46 H202 M26 40 V48 M22 44 H30", "b"],
];

const EXTRA: Record<string, Stroke[]> = { Argentina: ARGENTINA, Europe: EUROPE };

export function strokesFor(country: string): Stroke[] {
  return DOODLES[country]?.strokes ?? EXTRA[country] ?? [];
}
