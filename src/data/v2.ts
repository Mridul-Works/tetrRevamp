/**
 * Copy for /v2: Tetr content poured into a festival-poster structure
 * (reference: signalfest.framer.website). Figures reuse content.ts where they exist.
 */
import { LOGO, QS_BADGE, cohortStats, countries, hero, immersions, outcomesHeading, programs } from "./content";

export { LOGO, QS_BADGE };

/**
 * PLACEHOLDER: the Round 1 date in content.ts (15 Oct 2026) has passed, so the live
 * countdowns use a Round 2 date here. Confirm with admissions before launch.
 */
export const v2Deadline = "2027-01-15T23:59:59+05:30";
export const v2DeadlineLabel = "Round 2";

export type BeltItem = { k: string; v: string; image?: string };

/* ───────────── Contact & lead capture ───────────── */

/** Set NEXT_PUBLIC_WHATSAPP (digits only, with country code) to turn the WhatsApp links on. */
const wa = process.env.NEXT_PUBLIC_WHATSAPP;
const tel = process.env.NEXT_PUBLIC_PHONE;
export const v2Contact = {
  whatsapp: wa ? `https://wa.me/${wa}?text=${encodeURIComponent("Hi Tetr, I’d like details on the Aug ’26 intake.")}` : "https://tetr.com/contact-us",
  tel: tel ? `tel:${tel}` : "https://tetr.com/contact-us",
  hasWhatsapp: Boolean(wa),
  hasTel: Boolean(tel),
};

export const v2Lead = {
  id: "lead",
  eyebrow: "Aug ’26 intake",
  title: "Get fees, scholarships & the brochure",
  sub: "One form. Admissions calls you back within 24 hours with eligibility, fees and the scholarship you qualify for.",
  interests: ["Bachelor’s", "Master’s", "Executive", "High School", "Gap Year"],
  submit: "Send me the details",
  fine: "By submitting you agree to be contacted by Tetr admissions on phone, WhatsApp or email.",
  success: {
    title: "Done. Expect a call within 24 hours.",
    body: "Meanwhile, the brochure is yours, and admissions is one tap away.",
    brochure: { label: "Download the brochure", href: hero.handbook.href },
    whatsapp: "Chat on WhatsApp now",
  },
  error: {
    title: "That didn’t go through.",
    body: "Reach admissions directly instead, your details are not lost.",
    whatsapp: "WhatsApp admissions",
    call: "Call admissions",
  },
  /** Posted to this route; it validates and forwards to LEAD_WEBHOOK_URL. */
  endpoint: "/api/v2-lead",
};

export const v2Nav = {
  mark: "TETR®",
  links: [
    { label: "Programs", href: "#programs" },
    { label: "Route", href: "#route" },
    { label: "Outcomes", href: "#outcomes" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Get brochure", href: "#lead" },
};

export const v2Hero = {
  eyebrow: "Tetr College of Business",
  intake: "Aug ’26 intake",
  /** Three display lines; the middle one is set in the italic serif accent. */
  title: { a: "Learn business", accent: "by doing business", b: "in 7 countries" },
  body: "A new country every term. A real company you run. Graded on revenue.",
  cta: { label: "Get fees & scholarships", href: "#lead" },
  film: { label: "Watch the film", title: hero.filmTitle },
  deadline: v2Deadline,
  deadlineLabel: `${v2DeadlineLabel} closes in`,
  scroll: "Scroll",
  /** The stage: one wide frame and two smaller prints that drift toward the pointer. */
  photos: {
    main: { src: hero.images[1], alt: "Tetr students on the move between base camps" },
    a: { src: immersions[0].images[3], alt: "Students at the Taj Mahal", place: "New Delhi" },
    b: { src: immersions[4].images[1], alt: "Students at Nasdaq, New York", place: "New York" },
  },
  stops: ["New Delhi", "Dubai", "Shanghai", "Accra", "New York", "Buenos Aires", "Madrid"],
  badgeAlt: hero.badgeAlt,
};

export const v2LeadSection = {
  eyebrow: "(Next step)",
  title: "Fees, scholarships & the brochure, in one call.",
  points: [
    "Admissions calls within 24 hours",
    "Scholarships up to 100% decided with your offer",
    "No application fee in this round",
  ],
};

export const v2MidCta = {
  line: "Not sure which program fits?",
  accent: "Ask admissions.",
  body: "A 20-minute call covers eligibility, fees, scholarships and the route. No commitment.",
  cta: { label: "Get a call back", href: "#lead" },
  secondary: { label: "WhatsApp us", href: v2Contact.whatsapp },
};

export const v2Belt: BeltItem[] = [
  { k: "Tetr ’26", v: "Admit all · Round 2 closes 15 Jan" },
  { k: "Seven countries · Four years", v: "One degree, graded on revenue" },
  { k: "Dubai → Madrid", v: "One route covers the lot" },
  { k: "150+ businesses built", v: "$500K+ real revenue" },
];

/* ───────────── Countries: what each stop is famous for ───────────── */

export type V2Country = {
  term: string;
  name: string;
  city: string;
  accent: string;
  tag: string;
  bg: string;
  /** The postcard image: the thing the country is known for. */
  landmark: { title: string; image: string; desc: string };
  famous: string[];
  sets: { time: string; act: string; stage: string; tag: string }[];
  build: string;
  /** lat / lng of the base camp, for the globe */
  coords: [number, number];
  /** How you are greeted there */
  greeting: string;
  /** The playable thing for this stop: which toy, what it is called, and the one-line brief */
  toy: { key: ToyKey; title: string; hint: string };
};

export type ToyKey = "chai" | "burj" | "factory" | "kente" | "bell" | "penalty" | "lights";

/** Curated "famous for" per stop, keyed by the immersions name. */
const famousFor: Record<string, { city: string; landmarkIdx: number; famous: string[]; greeting: string; toy: V2Country["toy"] }> = {
  India: {
    city: "New Delhi", landmarkIdx: 3, famous: ["Taj Mahal", "Chai & street food", "Cricket", "1.4bn consumers"], greeting: "namaste",
    toy: { key: "chai", title: "Run a chai stall", hint: "Set the price of a cup. 1.4 billion customers decide if you got it right." },
  },
  Dubai: {
    city: "Dubai", landmarkIdx: 1, famous: ["Burj Khalifa", "Gold Souk", "Desert safari", "Ports & airlines"], greeting: "marhaba",
    toy: { key: "burj", title: "Build the Burj", hint: "Press and hold. It is 828 metres to the top." },
  },
  China: {
    city: "Shanghai", landmarkIdx: 2, famous: ["The Great Wall", "Shenzhen factories", "Super-apps", "High-speed rail"], greeting: "ni hao",
    toy: { key: "factory", title: "Run the factory line", hint: "Push the line speed. Watch what happens to quality." },
  },
  Ghana: {
    city: "Accra", landmarkIdx: 3, famous: ["Kente cloth", "Cocoa", "Highlife music", "Accra art district"], greeting: "akwaaba",
    toy: { key: "kente", title: "Weave your Kente", hint: "Pick a thread and paint the loom. Every pattern means something." },
  },
  "United States": {
    city: "New York", landmarkIdx: 1, famous: ["Wall Street", "Silicon Valley", "Nasdaq bell", "Broadway"], greeting: "howdy",
    toy: { key: "bell", title: "Ring the opening bell", hint: "Ring it and watch TETR trade." },
  },
  Argentina: {
    city: "Buenos Aires", landmarkIdx: 3, famous: ["Tango", "Asado", "La Bombonera", "The pampas"], greeting: "che, hola",
    toy: { key: "penalty", title: "Penalty at La Bombonera", hint: "Pick a corner. The keeper is guessing too." },
  },
  Europe: {
    city: "Madrid", landmarkIdx: 2, famous: ["Milan Fashion Week", "Tapas & the Prado", "Formula 1", "Flea markets of Lille"], greeting: "hola, ciao",
    toy: { key: "lights", title: "Lights out at Monza", hint: "Five red lights. When they go out, hit it." },
  },
};

const byTerm = [...countries].sort((a, b) => a.term - b.term);
const weeks = ["Wk 01–03", "Wk 04–06", "Wk 07–09", "Wk 10–12"];

export const v2Countries: V2Country[] = immersions.map((im, i) => {
  const f = famousFor[im.name];
  const c = byTerm[i];
  const landmarkNote = im.notes.find((n) => n.kind === "cultural") ?? im.notes[0];
  return {
    term: String(i + 1).padStart(2, "0"),
    name: c?.name ?? im.name,
    city: f.city,
    accent: im.accent,
    tag: im.tag.split("·")[1]?.trim() ?? im.tag,
    bg: im.bg,
    landmark: { title: landmarkNote.title, image: im.images[f.landmarkIdx], desc: landmarkNote.desc },
    famous: f.famous,
    sets: [
      ...im.notes.map((n, j) => ({ time: weeks[j], act: n.title, stage: n.kind === "business" ? "Inside the business" : "In the city", tag: n.kind === "business" ? "Build" : "Live" })),
      { time: "Wk 13", act: "Demo day", stage: "Main stage", tag: "Earn" },
    ],
    build: c?.build ?? "",
    coords: c?.coords ?? [0, 0],
    greeting: f.greeting,
    toy: f.toy,
  };
});

export const v2CountryBelt: BeltItem[] = v2Countries.map((c) => ({ k: c.name, v: `${c.city} · ${c.famous[0]}`, image: c.landmark.image }));

export const v2World = {
  eyebrow: "(The route)",
  title: "Seven countries.",
  accent: "Play each one.",
  sub: "Every term is a new country and a different game. Pick a stop, then try the thing it is famous for.",
  cta: { label: "Get the term-by-term guide", href: "#lead" },
  stats: [
    { value: cohortStats[0].value, label: "Students on the route" },
    { value: cohortStats[1].value, label: "Nationalities" },
    { value: outcomesHeading.totals[0].value, label: "Businesses built" },
    { value: "$500K+", label: "Earned by students" },
  ],
};

/** The route, laid out like a festival schedule: one column per term. */
export const v2Route = {
  eyebrow: "(The route)",
  title: "Seven terms — scroll through",
  sub: "Every term a new country. Every country, the thing it’s famous for, from the inside.",
  terms: v2Countries,
};

export type TierStatus = "Open" | "Closing soon" | "Closed";
export type Tier = {
  name: string;
  blurb: string;
  price: string;
  priceNote: string;
  status: TierStatus;
  bullets: string[];
  href: string;
};

const pick = (tab: (typeof programs)[number]["tab"]) => programs.filter((p) => p.tab === tab);
const titles = (tab: (typeof programs)[number]["tab"]) => pick(tab).map((p) => `${p.titleA} ${p.titleB}`);

export const v2Tickets: {
  eyebrow: string;
  kicker: string;
  title: string;
  feeNote: string;
  notes: string[];
  tiers: Tier[];
} = {
  eyebrow: "(Programs)",
  kicker: "Tear along the perforation · fee details in 24 hours",
  title: "Pick a program. We’ll send fees & scholarships.",
  feeNote: "Scholarships of up to 100% awarded on merit · Application fee waived for Round 1",
  notes: [
    "Offers can be deferred by one intake with written notice.",
    "Rounds close at 23:59 IST on the dates shown.",
    "Executive seats are confirmed on interview.",
  ],
  tiers: [
    {
      name: "Bachelor’s",
      blurb: "4 years · 7 countries",
      price: pick("Bachelor's")[0].deadline,
      priceNote: "Round 1 deadline",
      status: "Open",
      bullets: titles("Bachelor's"),
      href: "#lead",
    },
    {
      name: "Master’s",
      blurb: "1 year · 3 countries",
      price: pick("Master's")[0].deadline,
      priceNote: "Round 1 deadline",
      status: "Closing soon",
      bullets: titles("Master's"),
      href: "#lead",
    },
    {
      name: "Executive",
      blurb: "12–15 months · Hybrid",
      price: pick("Executive")[0].deadline,
      priceNote: "Round 1 deadline",
      status: "Open",
      bullets: titles("Executive"),
      href: "#lead",
    },
    {
      name: "Gap Year",
      blurb: "1 year · 9 countries",
      price: pick("Gap Year")[0].deadline,
      priceNote: "Application deadline",
      status: "Closed",
      bullets: ["Gap Year Innovation Program", "Build a business before you pick a degree", "Credits transfer into the Bachelor’s"],
      href: "#lead",
    },
  ],
};

export const v2Pillars = [
  { n: "01", title: "Learn", body: "Courses from Cornell, INSEAD and IIT faculty, taught in the country where they matter." },
  { n: "02", title: "Build", body: "A real company every term: dropshipping in Dubai, D2C in India, hardware in Shanghai." },
  { n: "03", title: "Earn", body: "You are graded on revenue. 91% of student teams are revenue positive." },
];

export const v2Plan = {
  eyebrow: "(Base camps)",
  kicker: "Learn it now. Land there in August.",
  title: "Everything you need, right where the business happens.",
  legend: v2Countries.map((t, i) => ({ n: String(i + 1), label: `${t.name} · ${t.city}`, famous: t.famous[0], image: t.landmark.image, accent: t.accent })),
  stats: [
    { value: cohortStats[0].value, label: "Students", note: "across 7 base camps" },
    { value: cohortStats[1].value, label: "Nationalities", note: "in one cohort" },
    { value: outcomesHeading.totals[0].value, label: "Businesses built", note: "since 2024" },
  ],
};

export const v2Info = {
  title: "Three things worth knowing before you apply.",
  cards: [
    {
      title: "Getting in",
      body: "Apply online, then a 20-minute conversation with admissions. Decisions in two weeks. No SAT cut-off, but the cohort average is 1490.",
    },
    {
      title: "What to bring",
      body: "A passport with two years left on it, a laptop, and one idea you’ve been sitting on. Housing, flights between terms and visas are handled by Tetr.",
    },
    {
      title: "Safety and care",
      body: "Every base camp has a resident team, 24/7 support line and local medical cover. Families get a term-by-term itinerary before you fly.",
    },
  ],
};

export const v2LastYear = {
  id: "outcomes",
  eyebrow: "(Last intake)",
  quoteHead: "Press review · Forbes India, 2025",
  quote:
    "A business school where the final exam is a P&L. Tetr students sold more in their first term than most MBA case studies describe.",
  stats: [
    { value: "$504K", label: "Revenue generated by students" },
    { value: "40%", label: "Teams that raised at demo day" },
  ],
};

export const v2Faq = {
  title: "Six answers, no small print",
  items: [
    { q: "Is the degree accredited?", a: "Yes. Bachelor’s degrees are awarded by partner universities in the US (STEM-designated) and the UK. Master’s and executive programs are co-certified with partner schools." },
    { q: "Can I defer my offer?", a: "Once, to the next intake, with written notice before the enrolment deadline. Scholarships carry over." },
    { q: "Are there scholarships?", a: "Merit scholarships cover 10–100% of tuition and are decided with the offer. No separate application." },
    { q: "Is there an age limit?", a: "Bachelor’s applicants should have finished secondary school by August. There is no upper limit for Master’s or executive programs." },
    { q: "What if I can’t get a visa for one country?", a: "The route adapts. You join a parallel base camp for that term and rejoin the cohort the term after." },
    { q: "Can I leave and re-enter?", a: "You can pause between terms for one term. Credits and your business stay yours." },
  ],
};

export const v2Closing = {
  title: "Still thinking about it?",
  formTitle: "Leave your number. We’ll do the rest.",
  sub: "The next round won’t wait.",
  line: "Tetr ’26, Aug intake, Base Camp 01 · Dubai",
  ticket: { label: "Get your seat", no: "№ 000 801", tail: "Admit all", href: "#lead" },
  partner: { label: "Talk to admissions", href: v2Contact.whatsapp },
  countdownLabel: "Dubai gets loud in exactly",
  deadline: v2Deadline,
};

export const v2Footer = {
  nav: [
    { label: "Route", href: "#route" },
    { label: "Programs", href: "#programs" },
    { label: "Base camps", href: "#plan" },
    { label: "FAQ", href: "#faq" },
    { label: "Plan your visit", href: "#visit" },
    { label: "Contact", href: "https://tetr.com/contact-us" },
  ],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/tetr.college/" },
    { label: "YouTube", href: "https://www.youtube.com/@tetrcollege" },
    { label: "LinkedIn", href: "https://www.linkedin.com/school/tetr-college-of-business/" },
  ],
  back: { label: "Back to v1", href: "/" },
  contact: { label: "Contact admissions", href: v2Contact.whatsapp },
  copy: "© 2026 Tetr College of Business",
};
