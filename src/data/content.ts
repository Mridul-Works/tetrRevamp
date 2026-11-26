/**
 * All homepage copy, links and media, taken verbatim from the reference
 * (tetr-homepage-v10.lovable.app/iteration-v12). Media lives in /public.
 * `**text**` marks the bold phrases used in the reference bylines.
 */

export type Link = { label: string; href: string };

/* ───────────────────────────── Navigation ───────────────────────────── */

export const LOGO = "/media/tetr/logo-header.png";
export const QS_BADGE = "/media/qs-gold-winner.png";

export const programMenu: { label: string; items: Link[] }[] = [
  {
    label: "Bachelor Programs",
    items: [
      { label: "Bachelor of Science in Artificial Intelligence", href: "https://tetr.com/bs-artificial-intelligence" },
      { label: "Bachelor of Finance & Artificial Intelligence", href: "https://tetr.com/bachelor-finance-ai" },
      { label: "Bachelor of Management & Technology", href: "https://tetr.com/bachelors-management-technology" },
      { label: "Integrated Bachelors and Masters in Management & Technology", href: "https://tetr.com/asu" },
    ],
  },
  {
    label: "Master Programs",
    items: [
      { label: "Master in Management of Technology", href: "https://tetr.com/masters-management-of-technology" },
      { label: "Graduate Program in Entrepreneurial Leadership", href: "https://programs.tetr.com/graduate-program-in-entrepreneurial-leadership" },
      { label: "Integrated Bachelors and Masters in Management & Technology", href: "https://tetr.com/asu" },
    ],
  },
  {
    label: "Executive Programs",
    items: [
      { label: "Global Family Business Leadership Program", href: "https://programs.tetr.com/family-business" },
      { label: "Global Capital Markets & Trading Program", href: "https://programs.tetr.com/capital-markets" },
    ],
  },
  {
    label: "Summer & Winter Programs",
    items: [
      { label: "Tetr Pathfinder: US Edition", href: "https://programs.tetr.com/pathfinder-program" },
      { label: "Tetr Pathfinder: China Edition", href: "https://program.tetr.com/pathfinder-program-china" },
      { label: "Tetr Pathfinder: Europe Edition", href: "https://program.tetr.com/pathfinder-program-europe" },
      { label: "Tetr 7-day Basecamp", href: "https://tetr.com/7_day_basecamp" },
    ],
  },
  {
    label: "Gap Year Programs",
    items: [{ label: "Gap Year Innovation Program", href: "https://tetr.com/gap-year-program" }],
  },
];

export const aboutMenu: Link[] = [
  { label: "About Tetr", href: "https://tetr.com/about" },
  { label: "Career Labs", href: "https://tetr.com/careers" },
  { label: "Tetr Events", href: "https://tetr.com/events" },
  { label: "Experiences at Tetr", href: "https://tetr.com/experiences-at-tetr" },
  { label: "Resources", href: "https://tetr.com/resources" },
  { label: "Student Entrepreneurship", href: "https://tetr.com/entrepreneurship" },
];

/* ───────────────────────────── Hero ───────────────────────────── */

export const hero = {
  titleA: "Learn Business by Doing Business",
  titleB: "Across the Globe",
  body: "Global Bachelor’s and Master’s programs in Management & Technology. Every term, you’ll live in a new country, build a real business, and get graded on what it earns.",
  badgeAlt: "QS Gold Winner, Most Innovative Business School 2025",
  handbook: { label: "Download Handbook", href: "https://online.flippingbook.com/view/313823554/" },
  film: "Watch Film",
  filmTitle: "Tetr: The Film",
  eyebrow: "Tetr College of Business",
  scrollCue: "Scroll to begin the route",
  /** People first: classroom, students on the move, then campuses and wins. */
  images: [4, 8, 5, 1, 9, 6, 2, 10, 7, 3].map((n) => `/media/tetr/hero/tetr-hero-${String(n).padStart(2, "0")}.jpg`),
};

/* ───────────────────────────── 10 Things ───────────────────────────── */

export const tenThingsIntro = {
  title: "10 Things to Know About Tetr",
  body: "Before you scroll, here's what you're getting into. The places you'll live, the people you'll build with, the businesses you'll launch. Ten videos, ten minutes, and you'll know whether this is for you.",
  image: "/img/design/dubai-cohort.jpg",
};

/** `*text*` marks the italic serif accent in titles. */
export const tenThings: {
  tag: string;
  title: string;
  body: string;
  image: string;
  stats: { value: string; label: string }[];
  /** The item's video: set one of these to play it in the lightbox; until then the lightbox shows "coming soon". */
  video?: { youtube?: string; instagram?: string; mp4?: string };
}[] = [
  {
    tag: "Built @ Tetr",
    title: "Our Students Have Generated Over *$500K* in Revenue",
    body: "We don't wait for students to graduate before they start building businesses. They do it every term, in real markets, with real customers.",
    image: "/media/tetr/tenthings/Built_at_Tetr-2.jpg",
    stats: [
      { value: "$500K+", label: "Revenue generated" },
      { value: "$200K+", label: "Capital raised" },
    ],
  },
  {
    tag: "D2C Bazaars",
    title: "*1.4 Billion* Ways to Get It *Right*. Or Wrong",
    body: "Different people, preferences, price points and reasons to buy. Tetr students learn to navigate all of them by launching their own D2C brands in India, where the consumer is always the final judge.",
    image: "/media/tetr/tenthings/D2C_Bazaar-2.jpg",
    stats: [
      { value: "$190K+", label: "Revenue generated" },
      { value: "30.6%", label: "Average profit margin" },
    ],
  },
  {
    tag: "Pitch Please",
    title: "You Can't Learn to *Pitch* From a Textbook",
    body: "So we put students on a stage and gave them something worth pitching. They learn to turn ideas into stories, defend their decisions and pitch with the confidence of having built it.",
    image: "/media/tetr/tenthings/Pitch_please-2.jpg",
    stats: [
      { value: "110", label: "Students" },
      { value: "45", label: "Countries" },
    ],
  },
  {
    tag: "Brand Wars",
    title: "Not All *Brand Wars* Are Fought in the Market",
    body: "Building the business is one thing. Convincing a room to back it is another. Brand Wars puts student founders head-to-head to sharpen their pitch and make a case for what they've built.",
    image: "/media/tetr/tenthings/Brand_Wars-3.jpg",
    stats: [],
  },
  {
    tag: "Millionaire",
    title: "You Could Make *A Million* Before You Graduate",
    body: "Students build businesses, take them to market and learn what it takes to turn an idea into revenue, from their first sale to their first serious milestone.",
    image: "/media/tetr/tenthings/millionaire-video.jpg",
    stats: [],
  },
  {
    tag: "Faculty",
    title: "Learn From People Who Are *Making the Case Studies*",
    body: "Founders, business leaders and industry experts teach in the classroom, so you learn directly from people who made the decisions you're studying.",
    image: "/media/tetr/tenthings/Faculty-3.jpg",
    stats: [
      { value: "40%", label: "Industry practitioners" },
      { value: "30%", label: "Visiting faculty" },
    ],
  },
  {
    tag: "Immersions",
    title: "Some Lessons Don't Fit Inside *Four Walls*",
    body: "From boardrooms and factories to markets and cultural landmarks, immersions turn every destination into part of the learning. You don't just visit a place. You get under its skin.",
    image: "/media/tetr/tenthings/immersions.jpg",
    stats: [
      { value: "90+", label: "Courses & workshops" },
      { value: "60+", label: "Immersions" },
    ],
  },
  {
    tag: "Founders Connect",
    title: "From “We Have an Idea” to “*People Paid for It*”",
    body: "Students took products from prototype to live Kickstarter campaigns. Across 17 campaigns, 1,100+ backers pledged more than $79,000.",
    image: "/media/tetr/tenthings/founders_connect-2.jpg",
    stats: [
      { value: "1,100+", label: "Backers" },
      { value: "$79.5K+", label: "Raised" },
    ],
  },
  {
    tag: "Career Labs",
    title: "Your Career Doesn't Need a *Home Address*",
    body: "Career Labs opens internships across global companies, startups and growth-stage ventures, spanning 23 countries and a wide range of industries.",
    image: "/media/tetr/tenthings/Career_Labs-3.jpg",
    stats: [
      { value: "110+", label: "Recruiters" },
      { value: "314", label: "Internships" },
    ],
  },
  {
    tag: "Locations",
    title: "A Degree That Takes You *40,000 km* From Ordinary",
    body: "Build in one market. Learn in another. Then do it again, across countries, cultures and industries.",
    image: "/media/tetr/tenthings/locations.jpg",
    stats: [
      { value: "10+", label: "Countries" },
      { value: "10+", label: "Businesses" },
    ],
  },
];

/* ───────────────────────────── The route ───────────────────────────── */

export const routeHeading = {
  line1: "A New Country Every Term,",
  line2: "a New Business Every Time You Land",
  byline:
    "In each country, you'll **build a business** and get graded on the **revenue and profit** it makes. Your final exam is a pitch to **real VCs**. By graduation, you won't just have studied business across continents. **You'll have built it there.**",
};

type Item = { title: string; description: string };
export type Country = {
  term: number;
  name: string;
  label: string;
  chips: string[];
  pitch: string;
  build: string;
  photos: string[];
  courses: Item[];
  business: Item[];
  cultural: Item[];
  partners: string[];
  /** lat / lng of the base camp city, used to place the country on the globe */
  coords: [number, number];
};

const gallery = (c: string) =>
  ["Campus", "Business", "Cultural", "StudentLife", "Acad"].map((t) => `/media/tetr/gallery/${c}_${t}.jpg`);

export const routeTabs = [
  { key: "courses", label: "Courses & Workshops" },
  { key: "business", label: "Business Immersions" },
  { key: "cultural", label: "Cultural Immersions" },
] as const;

export const countries: Country[] = [
  {
    term: 2,
    name: "Dubai",
    label: "Dubai",
    chips: ["Tetr Base Camp", "Dubai, UAE"],
    pitch: "Dubai's economy runs on moving goods across borders, with ports and airlines that reach much of the world within a few hours.",
    build: "An eCommerce brand built for a global audience. Make smart sourcing and pricing decisions and work towards 5 SKUs, $25,000 in revenue and a 30% margin.",
    photos: gallery("Dubai"),
    courses: [
      { title: "CS 102", description: "Build scalable software for platforms" },
      { title: "MAST 201", description: "Visualize data for healthcare" },
      { title: "SAMA 202", description: "Optimize campaigns with A/B testing" },
      { title: "FIFI 102", description: "Value companies and assess investments" },
    ],
    business: [
      { title: "Gitex Global", description: "the world's largest tech showcase" },
      { title: "Emirates Innovation HQ", description: "aviation innovation, prototyped at scale" },
      { title: "DIFC AI Campus", description: "AI and fintech across the Middle East" },
      { title: "DP World", description: "global trade and smart logistics" },
    ],
    cultural: [
      { title: "Desert Safari", description: "dunes, heritage and Arabian hospitality" },
      { title: "Gold Souq", description: "trade at an iconic bullion market" },
      { title: "Museum of the Future", description: "science, design and imagination" },
      { title: "Louvre Abu Dhabi", description: "art and civilisations under one dome" },
    ],
    partners: ["Emirates", "DIFC", "DP World", "Gitex Global"],
    coords: [25.2, 55.27],
  },
  {
    term: 1,
    name: "India",
    label: "India",
    chips: ["Tetr Base Camp", "FITT–IIT Delhi immersion"],
    pitch: "Few markets teach you as much about consumers as India, where hundreds of millions of buyers weigh every rupee and stay loyal only to brands they trust.",
    build: "A direct-to-consumer (D2C) business, such as an FMCG or consumer-products brand. Find your customer, test your pricing and build a route to market, with a $10,000 revenue target.",
    photos: gallery("India"),
    courses: [
      { title: "CS 101", description: "Design intelligent systems for real life" },
      { title: "CS 201", description: "Automate business workflows with code" },
      { title: "MAT 101", description: "Optimize delivery routes with calculus" },
      { title: "SAMA 101", description: "Launch products with a go-to-market plan" },
    ],
    business: [
      { title: "ITC", description: "FMCG, hospitality and agribusiness" },
      { title: "Nivia Sports", description: "manufacturing and brand excellence" },
      { title: "Pee Safe", description: "scaling a D2C femtech brand" },
      { title: "LinkedIn", description: "data, talent and the future of work" },
    ],
    cultural: [
      { title: "Jaipur Literature Festival", description: "the world's largest literary gathering" },
      { title: "Taj Mahal", description: "white marble at imperial scale" },
      { title: "Golden Temple", description: "faith, service and splendour" },
      { title: "Parliament House Visit", description: "inside the seat of Indian democracy" },
    ],
    partners: ["ITC", "LinkedIn", "Pee Safe", "Nivia Sports", "FITT–IIT Delhi"],
    coords: [28.61, 77.21],
  },
  {
    term: 3,
    name: "China",
    label: "China",
    chips: ["Tetr Base Camp", "Shanghai"],
    pitch: "Much of the world's hardware is made in China, and its supply chains take a product from prototype to production faster than almost anywhere else.",
    build: "A hardware product and a Kickstarter campaign that gets people behind it. Aim to raise at least $20,000 from a minimum of 100 backers.",
    photos: gallery("China"),
    courses: [
      { title: "CS 203", description: "Optimize hardware in embedded systems" },
      { title: "MAT 103", description: "Improve movie recommendations" },
      { title: "PHY 103", description: "Develop next-generation AI microchips" },
      { title: "FIFI 103", description: "Blockchain for payments and apps" },
    ],
    business: [
      { title: "Tesla Gigafactory", description: "automated production at scale" },
      { title: "Alibaba Campus", description: "the stack behind modern commerce" },
      { title: "Tencent HQ", description: "the super app economy" },
      { title: "Zhangjiang Hi-Tech Park", description: "China's silicon valley in Shanghai" },
    ],
    cultural: [
      { title: "Confucian Temple", description: "the depth of ancient Chinese philosophy" },
      { title: "Tea Ceremony", description: "mindfulness with a Tea Master" },
      { title: "Zhujiajiao Water Town", description: "canals and stone bridges" },
      { title: "Kung Fu or Tai Chi", description: "focus and discipline in motion" },
    ],
    partners: ["Tesla", "Alibaba", "Tencent"],
    coords: [31.23, 121.47],
  },
  {
    term: 4,
    name: "Ghana",
    label: "Ghana",
    chips: ["Tetr Base Camp", "Accra"],
    pitch: "Ghana has one of Africa's youngest populations and a growing culture of social enterprise, where lasting impact starts with listening.",
    build: "An NGO pilot focused on a local cause. Build meaningful partnerships and mobilise support to positively impact at least 200 lives.",
    photos: gallery("Ghana"),
    courses: [
      { title: "MAT 104", description: "Detect fraud at enterprise scale" },
      { title: "MAST 104", description: "Manage AI projects" },
      { title: "SAMA 104", description: "Build sales pipelines" },
      { title: "FIFI 104", description: "Banking for cross-border trade" },
    ],
    business: [
      { title: "Google AI Research Centre", description: "AI research built in Africa" },
      { title: "Meltwater Lab", description: "talent, mentorship and venture creation" },
      { title: "Coca-Cola", description: "manufacturing and brand strategy" },
      { title: "mPharma", description: "healthcare logistics across Africa" },
    ],
    cultural: [
      { title: "Safari Valley Eco Park", description: "wildlife in Adukrom's eco haven" },
      { title: "Beach Day", description: "sun, surf and coastal culture" },
    ],
    partners: ["Google", "Coca-Cola", "Meltwater", "mPharma"],
    coords: [5.6, -0.19],
  },
  {
    term: 5,
    name: "USA",
    label: "USA*",
    chips: ["Tetr Base Camp", "New York"],
    pitch: "More of the world's technology companies and venture capital are concentrated in the US than anywhere else, and its pace sets the standard.",
    build: "A tech startup chasing venture-scale growth. Ship a product, win early users and learn how capital backs ambitious companies.",
    photos: [
      "/media/tetr/United_States.jpg",
      "/media/tetr/build7/Tech_StartUp_United_States.jpg",
      "/media/tetr/locations/tech-startup.jpg",
      "/media/tetr/homes/usa-common-areas.jpg",
      "/media/tetr/homes/usa-outdoors.jpg",
    ],
    courses: [
      { title: "MAT 107", description: "Mathematics for real-world systems" },
      { title: "CS 107", description: "Hidden patterns inside massive data" },
      { title: "CS 207", description: "How humans and AI actually learn" },
      { title: "CS 307", description: "Model decisions between players" },
    ],
    business: [
      { title: "The New York Times", description: "behind world-class journalism" },
      { title: "Spotify HQ", description: "data, algorithms and the future of audio" },
      { title: "JPMorgan Chase / Goldman Sachs", description: "how global capital moves" },
      { title: "The AI Summit", description: "founders and researchers building AI" },
    ],
    cultural: [
      { title: "Pentagon & Capitol", description: "the American power centers" },
      { title: "Berkeley Art Museum", description: "where art meets technology" },
      { title: "East Coast Cities", description: "colonial and civil war history" },
      { title: "Ultra Music Festival", description: "volunteer at the world's largest stage" },
    ],
    partners: ["Spotify", "Goldman Sachs", "JPMorgan Chase", "The New York Times"],
    coords: [40.71, -74.0],
  },
  {
    term: 6,
    name: "Argentina",
    label: "Argentina",
    chips: ["Tetr Base Camp", "Buenos Aires"],
    pitch: "Argentina pairs vast farmland with some of the strongest wind and solar resources in the Americas, and founders who build through constant change.",
    build: "A green venture with sustainable cash flow, built inside a volatile economy where every assumption gets tested.",
    photos: [
      "/media/tetr/Argentina.jpg",
      "/media/tetr/build7/Green_Venture_Argentina.jpg",
      "/media/tetr/locations/green-venture.jpg",
      "/img/immersions/LosgroboGRoup_Argentina.webp",
      "/img/immersions/la_bombonera_stadium_Argentina.webp",
    ],
    courses: [],
    business: [
      { title: "Grupo Los Grobo", description: "agribusiness run on data and futures" },
      { title: "Distrito Arcos", description: "heritage rail arches reborn as retail" },
    ],
    cultural: [
      { title: "Agricultural Heartland", description: "gaucho traditions across the pampas" },
      { title: "La Bombonera", description: "football fandom as a national brand" },
    ],
    partners: ["Grupo Los Grobo", "Distrito Arcos"],
    coords: [-34.6, -58.38],
  },
  {
    term: 7,
    name: "Europe",
    label: "Europe",
    chips: ["Tetr Base Camp", "Madrid"],
    pitch: "Europe mixes lifestyle, luxury and street culture, the raw material for content and communities that brands want to reach.",
    build: "A social channel with an engaged audience. Find your creative niche, turn local stories into content and grow a community brands want to reach.",
    photos: [
      "/media/tetr/Europe.jpg",
      "/media/tetr/build7/Social_Channel_Europe.jpg",
      "/media/tetr/locations/social-channel.jpg",
      "/img/immersions/MilanFashionWeek_Europe.webp",
      "/img/immersions/pinacoteca_di_brera_europe.webp",
    ],
    courses: [
      { title: "CS 206", description: "Design algorithms for platforms" },
      { title: "MAST 206", description: "Big data inside global companies" },
      { title: "SAMA 306", description: "Analytics for subscription services" },
      { title: "FIFI 106", description: "Optimize capital structure" },
    ],
    business: [
      { title: "Iberdrola HQ, Madrid", description: "renewables at global scale" },
      { title: "La Nave Innovation Hub", description: "Madrid's leading startup hub" },
      { title: "El Corte Inglés HQ", description: "retail innovation at scale" },
    ],
    cultural: [
      { title: "Prado & Reina Sofía", description: "Spain's artistic heritage" },
      { title: "Lavapiés & Malasaña", description: "street art and bohemian Madrid" },
      { title: "Royal Palace of Madrid", description: "Europe's largest functioning palace" },
    ],
    partners: ["Iberdrola", "La Nave", "El Corte Inglés"],
    coords: [40.42, -3.7],
  },
];

/** Partner wordmarks that have a logo file; others render as text. */
export const partnerLogos: Record<string, { src: string; aspect: number; h: number }> = {
  ITC: { src: "/media/partners/itc.svg", aspect: 0.958, h: 34 },
  LinkedIn: { src: "/media/partners/linkedin.svg", aspect: 3.931, h: 18 },
  "Nivia Sports": { src: "/media/partners/nivia.svg", aspect: 2.368, h: 22 },
  "FITT–IIT Delhi": { src: "/media/partners/iitdelhi.svg", aspect: 7.115, h: 17 },
  Emirates: { src: "/media/partners/emirates.svg", aspect: 1.445, h: 26 },
  "DP World": { src: "/media/partners/dpworld.svg", aspect: 3.964, h: 17 },
  Tesla: { src: "/media/partners/tesla.svg", aspect: 1, h: 26 },
  Alibaba: { src: "/media/partners/alibaba.svg", aspect: 7.804, h: 15 },
  Tencent: { src: "/media/partners/tencent.svg", aspect: 7.349, h: 16 },
  Google: { src: "/media/partners/google.svg", aspect: 2.907, h: 19 },
  "Coca-Cola": { src: "/media/partners/cocacola.svg", aspect: 2.738, h: 22 },
  Spotify: { src: "/media/partners/spotify.svg", aspect: 1, h: 24 },
  "Goldman Sachs": { src: "/media/partners/goldmansachs.svg", aspect: 2.114, h: 19 },
  "JPMorgan Chase": { src: "/media/partners/jpmorgan.svg", aspect: 7.045, h: 17 },
  "The New York Times": { src: "/media/partners/nyt.svg", aspect: 8.854, h: 15 },
  Iberdrola: { src: "/media/partners/iberdrola.svg", aspect: 5.528, h: 15 },
};

/* ───────────────────────────── Programs ───────────────────────────── */

export const programsHeading = {
  line1: "Every Builder Starts Somewhere.",
  line2: "Explore Your Path",
  byline: "Whether you're finishing school, starting your career, or taking a year to find your direction, **there's a path built for you**.",
};

export const programTabs = ["Bachelor's", "Master's", "Executive", "High School", "Gap Year"] as const;
export type ProgramTab = (typeof programTabs)[number];

const prog = (f: string) => `/media/tetr/programs/${f}.jpg`;
export const programs: {
  tab: ProgramTab;
  degree: string;
  titleA: string;
  titleB: string;
  duration: string;
  locations: string;
  deadlineLabel: string;
  deadline: string;
  image: string;
  href: string;
}[] = [
  { tab: "Bachelor's", degree: "US Degree (STEM)", titleA: "Bachelor of", titleB: "Science in Artificial Intelligence", duration: "4 Years", locations: "7 Countries", deadlineLabel: "Round 1 Deadline", deadline: "15th Oct, 2026", image: prog("Bachelor_of_Science_in_Artificial_Intelligence_Bachelor"), href: "https://tetr.com/bs-artificial-intelligence" },
  { tab: "Bachelor's", degree: "UK Degree", titleA: "Bachelor of", titleB: "Finance & Artificial Intelligence", duration: "4 Years", locations: "7 Countries", deadlineLabel: "Round 1 Deadline", deadline: "15th Oct, 2026", image: prog("Bachelor_of_Finance_Artificial_Intelligence_Bachelor"), href: "https://tetr.com/bachelor-finance-ai" },
  { tab: "Bachelor's", degree: "UK Degree", titleA: "Bachelor of", titleB: "Management & Technology", duration: "4 Years", locations: "7 Countries", deadlineLabel: "Round 1 Deadline", deadline: "15th Oct, 2026", image: prog("Bachelor_of_Management_Technology_Bachelor"), href: "https://tetr.com/bachelors-management-technology" },
  { tab: "Bachelor's", degree: "US Degree (STEM)", titleA: "Integrated Bachelors and Masters in", titleB: "Management & Technology", duration: "4 Years", locations: "7 Countries", deadlineLabel: "Round 1 Deadline", deadline: "15th Oct, 2026", image: prog("Integrated_Bachelors_and_Masters_in_Management_Technology_Bachelor"), href: "https://tetr.com/asu" },
  { tab: "Master's", degree: "Master's Degree", titleA: "Master in", titleB: "Management of Technology", duration: "1 Year", locations: "3 Countries", deadlineLabel: "Round 1 Deadline", deadline: "15th Sept, 2026", image: prog("Master_in_Management_of_Technology_Masters"), href: "https://tetr.com/masters-management-of-technology" },
  { tab: "Master's", degree: "Graduate Program", titleA: "Graduate Program in", titleB: "Entrepreneurial Leadership", duration: "1 Year", locations: "3 Countries", deadlineLabel: "Round 3 Deadline", deadline: "20th April, 2026", image: prog("Graduate_Program_in_Entrepreneurial_Leadership"), href: "https://programs.tetr.com/graduate-program-in-entrepreneurial-leadership" },
  { tab: "Executive", degree: "Executive", titleA: "Executive Program in", titleB: "Capital Markets", duration: "12 Months", locations: "Hybrid", deadlineLabel: "Round 1 Deadline", deadline: "30th Sept, 2026", image: prog("Capital_Market_Executive"), href: "https://programs.tetr.com/capital-markets" },
  { tab: "Executive", degree: "Executive", titleA: "Executive Program in", titleB: "Family Business", duration: "15 Months", locations: "Hybrid", deadlineLabel: "Round 1 Deadline", deadline: "30th Sept, 2026", image: prog("Family_Business_Executive"), href: "https://programs.tetr.com/family-business" },
  { tab: "High School", degree: "Pre-College", titleA: "High School", titleB: "7-Day Basecamp", duration: "1 Week", locations: "Dubai", deadlineLabel: "Application Deadline", deadline: "30th April, 2026", image: prog("7_-_Day_Basecamp_HighSchool"), href: "https://tetr.com/7_day_basecamp" },
  { tab: "High School", degree: "Cohort", titleA: "High School", titleB: "Tetr Pathfinder", duration: "2 Weeks", locations: "Dubai", deadlineLabel: "Application Deadline", deadline: "30th April, 2026", image: prog("Tetr_-_Pathfinder_-High_School"), href: "https://programs.tetr.com/pathfinder-program" },
  { tab: "Gap Year", degree: "Gap Year", titleA: "Gap Year", titleB: "Innovation Program", duration: "1 Year", locations: "9 Countries", deadlineLabel: "Application Deadline", deadline: "10th Aug, 2026", image: prog("Gap_Year"), href: "https://tetr.com/gap-year-program" },
];

export const universitiesHeading = {
  line1: "Some of the World's Leading Universities",
  line2: "Are on Your Route",
  byline:
    "As you move across Tetr's global base camps, you'll study at partner universities like **Cornell, INSEAD, and IIT**. You'll learn from their faculty and walk their campuses, so you get academic depth alongside the real-world building.",
};

export const universities: { name: string; logo: string; photo: string; nativeColor?: boolean; logoH: number }[] = [
  { name: "Cornell University", logo: "/img/unis/white/CORNELL.png", photo: "/media/collab/collab-cornell.jpg", logoH: 62 },
  { name: "UBI Business School", logo: "/img/unis/white/UBI.png", photo: "/media/collab/collab-ubi.jpg", logoH: 80 },
  { name: "FITT — IIT Delhi", logo: "/img/unis/white/FIIT.png", photo: "/media/collab/collab-fitt.jpg", logoH: 75 },
  { name: "Illinois Tech", logo: "/img/unis/white/Illinois.png", photo: "/media/collab/collab-illinois.jpg", logoH: 80 },
  { name: "INSEAD Executive Education", logo: "/media/unis/insead-logo.png", photo: "/media/collab/collab-insead.jpg", nativeColor: true, logoH: 62 },
  { name: "Adelphi University", logo: "/img/unis/white/ADELPHI.png", photo: "/media/collab/collab-adelphi.jpg", logoH: 71 },
];

/** Boarding pass shown once the university collage settles; it zooms into the Outcomes section. */
export const onboardTicket = {
  eyebrow: "Boarding Pass",
  title: "You're",
  titleAccent: "Onboard",
  from: { code: "DXB", city: "Dubai" },
  to: { code: "MAD", city: "Madrid" },
  fields: [
    { label: "Passenger", value: "You" },
    { label: "Route", value: "7 Countries" },
    { label: "Gate", value: "Base Camp 01" },
    { label: "Seat", value: "01A" },
  ],
  stamp: "Onboard",
  stub: { flight: "TETR 01", status: "Now Boarding" },
};

/* ───────────────────────────── Outcomes ───────────────────────────── */

export const outcomesHeading = {
  line1: "Forget Simulations,",
  line2a: "Tetr Students Have Generated",
  line2b: "$500K+ in Real Revenue",
  byline:
    "Grades Tell You What You Know. Revenue Tells You What You Can Do. Here's What Students Have Built, Term By Term. **91%** students are revenue positive with average revenue $8K. **40%** of Tetr Students Teams have raised funds during demo days",
  stage: { image: "/media/tetr/pitch/tetr-tank-stage.jpg", alt: "Tetr students and staff on the Tetr Tank stage with the winner cheque" },
  totals: [
    { label: "Businesses Built", value: "150+" },
    { label: "Revenue Generated", value: "USD 504,000+" },
    { label: "Funds Raised", value: "USD 180,000+" },
  ],
};

export type Company = {
  name: string;
  cohort: string;
  image: string;
  href?: string;
  figures: { label: string; value: string }[];
  description?: string;
};
export type Story = { name: string; image: string; index: string; figure: { value: string; label: string }; description: string };
export type Startup = { name: string; logo?: string; logoBare?: boolean; description: string };
export type Thumb = { name: string; image: string; cohort: string; video?: string };

export type Chapter = {
  country: string;
  model: string;
  chapter: string;
  title: string;
  body: string;
  metrics: { value: string; label: string }[];
  report?: { label: string; href: string };
  partB: { line1: string; line2?: string; line3?: string };
  ventures: { name: string; image: string; youtube?: string; static?: boolean }[];
  showcase:
    | { kind: "companies"; companies: Company[] }
    | { kind: "thumbnails"; thumbnails: Thumb[] }
    | { kind: "stories"; stories: Story[] }
    | { kind: "startups"; startups: Startup[] };
};

const oc = (f: string) => `/media/tetr/outcomes-v12/${f}`;

export const chapters: Chapter[] = [
  {
    country: "Dubai",
    model: "Dropshipping",
    chapter: "Chapter 1 · Dubai · Dropshipping",
    title: "Week One, You Have Nothing. By Term's End, Strangers Are Paying You",
    body: "By the end of term, you've chosen what to sell, built the store, run the ads and watched a stranger pay you. Then you do it again, and again, until your margin holds. That's dropshipping in the world's trade capital.",
    metrics: [
      { value: "59", label: "Businesses Built" },
      { value: "$172K+", label: "Revenue Generated" },
      { value: "21.86%", label: "Average Profit Margin" },
    ],
    report: { label: "Download Dropshipping Report", href: "https://online.flippingbook.com/view/631102570/" },
    partB: {
      line1: "Who Backs You: Tetr Tank",
      line2: "Pitch to the investors who move capital across the Middle East.",
      line3: "You take your store's numbers to the VCs and investors leading the Dubai and MENA ecosystem.",
    },
    ventures: [
      { name: "Tafflo", image: "/media/tetr/startups/Tafflo.jpg" },
      { name: "Bike Arena", image: "/media/tetr/startups/Bike_Arena.jpg" },
      { name: "Welz Company", image: "/media/tetr/startups/Welz_Thumbnail.jpg" },
    ],
    showcase: {
      kind: "companies",
      companies: [
        { name: "TAFFLO", cohort: "Class of 2028", image: oc("tafflo-refresh.jpg"), figures: [{ label: "Revenue", value: "$18,008" }, { label: "Profit Margin", value: "63.64%" }], description: "Wireless chargers and health-tracking smart rings, bringing accessible technology and sleek design into everyday life." },
        { name: "Illurex", cohort: "Class of 2029", image: oc("illurex-refresh.jpg"), figures: [{ label: "Revenue", value: "$6,154" }, { label: "ROAS", value: "1.1%" }], description: "Compact, hands-free 4K POV cameras for creators, adventurers and everyday users capturing life in motion." },
        { name: "Bike Arena", cohort: "Class of 2028", image: oc("bike-arena-refresh.jpg"), figures: [{ label: "Revenue", value: "$102,361" }, { label: "Profit Margin", value: "21.98%" }], description: "High-performance bicycles, custom builds and personalised consultations. New, demo and pre-owned bikes matched to the customer’s needs." },
        { name: "Claycia", cohort: "Class of 2028", image: oc("claycia-refresh.jpg"), figures: [{ label: "Revenue", value: "$5,342" }, { label: "Profit Margin", value: "12.47%" }] },
        { name: "Elantherm", cohort: "Class of 2029", image: oc("elantherm-refresh.jpg"), figures: [{ label: "Revenue", value: "$1,906" }, { label: "Profit Margin", value: "30%" }] },
      ],
    },
  },
  {
    country: "India",
    model: "D2C",
    chapter: "Chapter 2 · India · D2C Brand",
    title: "Anyone Can Sell Once. You'll Build A Brand People Come Back To",
    body: "Selling someone else's product taught you how to get a customer. Now you learn how to keep one. In the world's largest consumer market, you find a manufacturer, design the packaging, set the price and sell face to face at a live market. Then you stand in front of real founders and ask for their money.",
    metrics: [
      { value: "21", label: "Brands Built" },
      { value: "$186,862", label: "Revenue Generated" },
      { value: "30.62%", label: "Average Profit Margin" },
    ],
    report: { label: "Download D2C Report", href: "https://online.flippingbook.com/view/1009456202/" },
    partB: {
      line1: "Who Backs You: Brand Wars",
      line2: "Pitch to the founders and VCs who built India's D2C boom.",
      line3: "The top brands pitch to the people behind Noise, DailyObjects, Rare Rabbit. Gokwik. Innovis and The Moms Co., alongside investors from ChrysCapital, 247 VC. Last cohort raised $107K.",
    },
    ventures: [
      { name: "Eraaya", image: oc("d2c-eraaya.jpg") },
      { name: "Kalaam", image: oc("d2c-kalaam.jpg") },
      { name: "Match It", image: oc("d2c-match-it.jpg") },
      { name: "Buss Tea", image: oc("d2c-buss-tea.jpg") },
      { name: "Tiora", image: oc("d2c-tiora.jpg") },
    ],
    showcase: {
      kind: "companies",
      companies: [
        { name: "Six Oppas", cohort: "Class of 2028", image: oc("six-oppas.jpg"), href: "https://www.instagram.com/hwarang.seoul", figures: [{ label: "Revenue", value: "$10,200" }, { label: "Profit Margin", value: "18.35%" }] },
        { name: "Serve", cohort: "Class of 2028", image: oc("serve.jpg"), figures: [{ label: "Revenue", value: "$5,286" }, { label: "Profit Margin", value: "43.2%" }] },
        { name: "Maison & Co", cohort: "Class of 2028", image: oc("maison-co.jpg"), href: "https://www.instagram.com/maisonandcoofficial", figures: [{ label: "Revenue", value: "$11,402" }, { label: "Profit Margin", value: "28.94%" }] },
        { name: "Ikrara", cohort: "Class of 2028", image: oc("ikrara.jpg"), href: "https://www.instagram.com/ikrara.official", figures: [{ label: "Revenue", value: "$120,210" }, { label: "Profit Margin", value: "16.99%" }] },
        { name: "Knotcultured", cohort: "Class of 2028", image: oc("knotcultured.jpg"), href: "https://www.instagram.com/knotcultured", figures: [{ label: "Revenue", value: "$11,460" }, { label: "Profit Margin", value: "61.78%" }] },
      ],
    },
  },
  {
    country: "China",
    model: "Kickstarter",
    chapter: "Chapter 3 · China · Kickstarter",
    title: "Get 100 Strangers To Pay For Something That Doesn't Exist Yet",
    body: "This time there's no product to source. You find a problem, design a physical fix, prototype it and launch it on Kickstarter. The rules are brutal: at least 10 real backers, and hit 100% of your goal or you get nothing. No marks for effort. Just strangers deciding whether your idea is worth their money.",
    metrics: [
      { value: "17", label: "Campaigns Launched" },
      { value: "$79,532", label: "Funds Raised" },
      { value: "1,100+", label: "Backers Worldwide" },
    ],
    report: { label: "Download Kickstarter Report", href: "https://online.flippingbook.com/view/918723207/" },
    partB: {
      line1: "Who Backs You: The World",
      line2: "Your investors are strangers on the internet, and they pay upfront.",
      line3: "You build in public, launch on Kickstarter and win over consumers who've never met you. Last cohort, 1,100+ backers from around the world put money behind products that didn't exist yet.",
    },
    ventures: [{ name: "Kickstarter Showdown", image: oc("kickstarter-showdown-v2.jpg"), youtube: "IJBGmwVnLQY" }],
    showcase: {
      kind: "thumbnails",
      thumbnails: [
        { name: "ClickBuddy", image: oc("clickbuddy-v2.jpg"), cohort: "Class of 2028", video: oc("Clickbuddy.mp4") },
        { name: "Meridian", image: oc("meridian-v2.jpg"), cohort: "Class of 2028", video: oc("Meridian.mp4") },
        { name: "Kando", image: oc("kando-v2.jpg"), cohort: "Class of 2028", video: oc("Kando.mp4") },
        { name: "Critter Chaos", image: oc("critter-chaos-v2.jpg"), cohort: "Class of 2028" },
        { name: "Slide Pass", image: oc("slide-pass-v2.jpg"), cohort: "Class of 2028" },
      ],
    },
  },
  {
    country: "Ghana",
    model: "NGO",
    chapter: "Chapter 4 · Ghana · NGO",
    title: "Find A Real Problem And Build The Social Venture That Fixes It",
    body: "In Ghana, the customer is a community. You spend weeks in classrooms, markets and neighbourhoods listening before you build anything. Then you launch a venture and measure success in lives, not dollars. You'll leave knowing the best businesses do both.",
    metrics: [
      { value: "11,530", label: "Lives Touched" },
      { value: "17", label: "Ventures Launched" },
      { value: "13", label: "Teams Past 200 Lives" },
    ],
    report: { label: "Download NGO Report", href: "https://online.flippingbook.com/view/111707919/" },
    partB: { line1: "The stories behind the impact" },
    ventures: [{ name: "Impact Showdown", image: "/media/tetr/startups/Ghana_Impact_Showdown.png", static: true }],
    showcase: {
      kind: "stories",
      stories: [
        { name: "Nsuo Nkwah", image: oc("nsuo-nkwah.webp"), index: "01", figure: { value: "2,507", label: "Lives touched" }, description: "Helping communities protect one of their most essential resources: clean water." },
        { name: "The Savannah Project", image: oc("savannah-project.webp"), index: "02", figure: { value: "1,973", label: "Lives touched" }, description: "Opening the first door to career training, employment and opportunity." },
        { name: "Akoma", image: oc("akoma.webp"), index: "03", figure: { value: "611", label: "Lives touched" }, description: "Transforming science from something students memorise into something they experience." },
        { name: "RealGH", image: oc("realgh.webp"), index: "04", figure: { value: "1,425", label: "Lives touched" }, description: "Helping local artisans bring their craftsmanship to new markets." },
        { name: "Outboxed", image: oc("outboxed.webp"), index: "05", figure: { value: "550", label: "Lives touched" }, description: "Connecting Bukom’s boxing talent with sponsors and a stronger sporting future." },
        { name: "HerMoney", image: oc("hermoney.webp"), index: "06", figure: { value: "367", label: "Lives touched" }, description: "Building financial confidence for women growing their own businesses." },
      ],
    },
  },
  {
    country: "USA",
    model: "AI SaaS",
    chapter: "Chapter 5 · USA · AI SaaS",
    title: "Build An AI Startup In The City That Funds Them",
    body: "You've sold, branded, built and served. Now you build software. In New York, you take a problem you spotted somewhere in your travels and turn it into an AI SaaS product, then pitch it to investors in the city where IPOs happen.",
    metrics: [],
    partB: {
      line1: "Who Backs You: Silicon Valley",
      line2: "Pitch your AI startup to the investors who back the world's biggest tech companies.",
      line3: "Every team takes its AI product to leading investors and ecosystem builders from Silicon Valley.",
    },
    ventures: [{ name: "AI Showdown", image: "/media/tetr/startups/USA_Met_Group.png", static: true }],
    showcase: {
      kind: "startups",
      startups: [
        { name: "Blüm", logo: oc("usa-blum-logo.png"), description: "Unlocking a longer, more vibrant life through one private, holistic guide to your health." },
        { name: "Buffer", logo: oc("usa-buffer-logo.png"), logoBare: true, description: "Turning the seconds you spend waiting on AI into real rewards, so no moment goes to waste." },
        { name: "Acceify", logo: oc("usa-acceify-logo.png"), description: "Empowering college counselors to guide more students toward their dream universities, with AI handling the busywork." },
        { name: "Tend", description: "Freeing finance teams from chasing receipts, with expenses submitted on WhatsApp and reviewed by AI." },
      ],
    },
  },
];

/* ───────────────────────────── Launchpad ───────────────────────────── */

export const launchpad = {
  eyebrow: "TETR LAUNCHPAD",
  titleA: "What If Your First Investor",
  titleB: "Was",
  titleAccent: "Already Waiting for You?",
  body: "Behind every business you build at Tetr sits a $10 million fund reserved for Tetr students. When your idea shows real promise, Launchpad backs it with capital, mentorship, and a global network of investors and operators who've done this before. You bring the idea, and we'll help you take it further.",
  image: "/media/design/launchpad-pitch.jpg",
  imageAlt: "Tetr students holding their Brand Wars investment cheques",
  cta: { label: "Explore Launchpad", href: "https://tetr.com/launchpad" },
  secondary: { label: "Still in high school? Pitch to Launchpad", href: "https://tetr.com/launchpad" },
};

/* ───────────────────────────── Career Labs ───────────────────────────── */

export const careerLabs = {
  eyebrow: "Career Labs at Tetr",
  line1: "Your Internship Starts in Year One,",
  line2: "Not Your Final Year",
  byline:
    "One year into college, **70% of our students** had already secured internships, with **stipends of up to $4,000**. Through Career Labs, you'll unlock internships across **23 countries**, from Google and Formula 1 to BlackRock, eBay, and high-growth startups.",
  mapTitle: "Where Tetr Students Interned",
  report: { label: "Download career lab report", href: "https://online.flippingbook.com/view/1040912480/" },
  map: { src: "/img/design/placement-map.jpg", alt: "World map of where Tetr students interned" },
  stats: [
    { label: "Year One", value: "70%", text: "of students secured internships before their second year" },
    { label: "Internships", value: "314", text: "placements in the 2025-26 academic year" },
    { label: "Reach", value: "23", text: "countries and regions on the placement map" },
    { label: "Stipends", value: "$204K+", text: "cumulative stipends earned by the cohort" },
  ],
  interns: [
    { company: "Formula 1", founder: "Anshika Agarwal · Class of 2029", photo: "/media/tetr/careerlabs-v11/tetr-cl11-f1-anshika.jpg" },
    { company: "Google", founder: "Loris De Rosso · Class of 2028", photo: "/media/tetr/careerlabs-v11/tetr-cl11-google-loris.jpg" },
    { company: "eBay", founder: "Tanisha Gureja · Class of 2028", photo: "/media/tetr/careerlabs-v11/tetr-cl11-ebay-tanisha.jpg" },
    { company: "DIFC", founder: "Weronika Leśniak · Class of 2028", photo: "/media/tetr/careerlabs-v11/tetr-cl11-difc-weronika.jpg" },
    { company: "Emeritus", founder: "Nicoleta Dicusar · Class of 2028", photo: "/media/tetr/careerlabs-v11/tetr-cl11-emeritus-nicoleta.jpg" },
    { company: "CertiK", founder: "Lucas Ceccon · Class of 2028", photo: "/media/tetr/careerlabs-v11/tetr-cl11-certik-lucas.jpg" },
    { company: "Jio BlackRock", founder: "Antriksh Gupta · Class of 2029", photo: "/media/tetr/careerlabs-v11/tetr-cl11-blackrock-antriksh.jpg" },
    { company: "noon", founder: "Santiago Vaca · Class of 2029", photo: "/media/tetr/careerlabs-v11/tetr-cl11-noon-santiago.jpg" },
    { company: "AXA", founder: "Judy Ayman · Class of 2028", photo: "/media/tetr/careerlabs-v11/tetr-cl11-axa-judy.jpg" },
  ],
  tiles: [
    { value: "$204K+", label: "Cumulative stipends earned by the cohort across the year", tone: "deep" },
    { value: "314", label: "Internships placed in academic year 2025-26", tone: "paper" },
    { value: "110+", label: "Recruiters from leading global organisations", tone: "mid" },
    { value: "23", label: "Countries & regions on this cohort's placement map", tone: "paper" },
    { value: "216", label: "CXOs hosted on campus in the last two years", tone: "dark" },
  ] as { value: string; label: string; tone: "deep" | "paper" | "mid" | "dark" }[],
  cta: { headline: "Career Labs", body: "Read the full Career Labs Report 2025-26.", label: "Read the report", href: "https://online.flippingbook.com/view/1040912480/" },
  recruitersLabel: "Recruiting organizations",
  recruiters: [
    { name: "HP", src: "/media/recruiters/hp.svg", aspect: 1, h: 26 },
    { name: "McKinsey", src: "/media/recruiters/mckinsey.svg", aspect: 8.821, h: 16 },
    { name: "Reckitt", src: "/media/recruiters/reckitt.svg", aspect: 2.846, h: 18 },
    { name: "Toyota", src: "/media/recruiters/toyota.svg", aspect: 1.471, h: 24 },
    { name: "Goldman Sachs", src: "/media/recruiters/goldmansachs.svg", aspect: 2.326, h: 20 },
    { name: "Deloitte", src: "/media/recruiters/deloitte.svg", aspect: 5.355, h: 18 },
    { name: "Uber", src: "/media/recruiters/uber.svg", aspect: 2.976, h: 18 },
    { name: "Nestlé", src: "/media/recruiters/nestle.svg", aspect: 3.661, h: 22 },
    { name: "Pepsi", src: "/media/recruiters/pepsi.svg", aspect: 1, h: 24 },
    { name: "Siemens", src: "/media/recruiters/siemens.svg", aspect: 6.024, h: 18 },
  ],
};

/* ───────────────────────────── Faculty ───────────────────────────── */

export const facultyHeading = {
  line1: "The People Teaching You Have Run",
  line2: "NASA's Knowledge Office, Estée Lauder, and SoftBank India",
  byline:
    "**Every class at Tetr is a “how to,”** taught by someone who has done it at the highest level. So when you're stuck on pricing in Dubai or fundraising in the US, you're learning from people who've made those exact calls in real companies. And when you need more, **100+ mentors across industries** are a message away.",
  mixLabel: "The 40 / 30 / 30 Mix",
  showAll: "Show all",
  cta: { label: "Meet the Faculty", href: "https://tetr.com/faculty" },
};

export type FacultyGroup = "industry" | "fulltime" | "visiting";
export const facultyMix: { key: FacultyGroup; pct: string; title: string; body: string }[] = [
  { key: "industry", pct: "40%", title: "Industry Practitioners", body: "CEOs, founders and operators teaching what they're building today." },
  { key: "fulltime", pct: "30%", title: "Full-Time Faculty", body: "PhDs from India's and the world's top institutions. FT50 / A* research." },
  { key: "visiting", pct: "30%", title: "Visiting Faculty", body: "Professors from Harvard, Stanford, Wharton, Kellogg, Columbia, NYU, Cornell, Imperial." },
];

export const faculty: {
  name: string;
  title: string;
  image: string;
  group: FacultyGroup;
  org: string;
  logo: string;
  interestLabel: string;
  interest: string;
}[] = [
  { name: "Mr. Faverie Stephane", title: "Executive Group President", image: "/img/faculty/faverie.png", group: "industry", org: "Estée Lauder", logo: "/img/faculty/logo-estee.png", interestLabel: "Area of Interest", interest: "Global Markets and Customer Dynamics" },
  { name: "Dr. Lan Ma", title: "Academician Adjunct Professor of Business", image: "/img/faculty/lanma.png", group: "fulltime", org: "NYU Shanghai", logo: "/img/faculty/logo-nyu.png", interestLabel: "Teaching", interest: "How to market strategically in the real world" },
  { name: "Dr. Edward Rogers", title: "Former Chief Knowledge Officer", image: "/img/faculty/rogers.png", group: "industry", org: "NASA", logo: "/img/faculty/logo-nasa.png", interestLabel: "Teaching", interest: "How to Manage Complexities" },
  { name: "Dr. Zal Phiroz", title: "Adjunct Professor", image: "/img/faculty/zal.png", group: "visiting", org: "Harvard University", logo: "/img/faculty/logo-harvard.png", interestLabel: "Teaching", interest: "How companies manage supply chain to procure & ship globally" },
  { name: "Mr. Nitin Gaur", title: "Former Advisory Board Member", image: "/img/faculty/nitin.png", group: "industry", org: "Stanford University", logo: "/img/faculty/logo-stanford.png", interestLabel: "Area of Interest", interest: "How to Innovate in Fintech" },
  { name: "Dr. Daniel Garett Van Der Vliet", title: "Executive Director", image: "/img/faculty/daniel.png", group: "visiting", org: "Cornell University", logo: "/img/faculty/logo-cornell.png", interestLabel: "Area of Interest", interest: "Leadership & Family Business" },
  { name: "Dr. Zvi Gilula", title: "Professor", image: "/img/faculty/zvi.png", group: "fulltime", org: "Chicago Booth", logo: "/img/faculty/logo-chicago.png", interestLabel: "Area of Interest", interest: "Statistics and Marketing" },
  { name: "Dr. James Hayton", title: "Professor", image: "/img/faculty/hayton.png", group: "fulltime", org: "Warwick Business School", logo: "/img/faculty/logo-warwick.png", interestLabel: "Area of Interest", interest: "Innovation and Entrepreneurship" },
  { name: "Dr. Shad Morris", title: "Former Faculty Fellow", image: "/img/faculty/shad.png", group: "visiting", org: "MIT Sloan", logo: "/img/faculty/logo-mit.png", interestLabel: "Teaching", interest: "How to work effectively in teams" },
];

export const masterclasses = {
  titleA: "Learn From Top CXOs",
  titleB: "and Ivy League Faculty",
  body: "Your classroom is powered by top CXOs and Ivy League faculty, from Harvard to NASA, from Cornell to Estée Lauder. Our faculty don't just teach the playbook. They wrote it.",
  items: [
    { title: "Should Economics Be Scrapped From B-Schools?", image: "/media/masterclasses/Professors_Thumbnails_15.webp" },
    { title: "Your Ideas Don't Matter Unless People Listen", image: "/media/masterclasses/Professors_Thumbnails_17.webp" },
    { title: "You're Using AI Wrong", image: "/media/masterclasses/Kate_Busby1.1.png" },
    { title: "What Does It Take to Scale Tech?", image: "/media/masterclasses/Donn_Koh_Vertical_2b.png" },
  ],
};

/* ───────────────────────────── Creators ───────────────────────────── */

export const creatorsHeading = {
  line1: "The Internet Is Already",
  line2: "Talking About Tetr",
  byline:
    "Some of the **world's biggest creators** followed our students across countries and classrooms. **Here's what they saw**, unscripted and in their own words.",
};

export const creators = [
  { title: "He created the world's coolest college", guest: "Daniel Mac", image: "/media/tetr/creators/Creator_DanielMac_v2.jpg", instagram: "DUtX_imkRWa" },
  { title: "The luckiest students in the world", guest: "Luisito Comunica", image: "/media/tetr/creators/Creator_Luisito_Refresh.jpg", instagram: "DPlyKI3jo5z" },
  { title: "7 countries, 7 real businesses, one degree", guest: "Haley Baylee", image: "/media/tetr/creators/Creator_HaleyBaylee_v3.jpg", instagram: "DVy5FaHj9Fm" },
  { title: "Something cool for you guys", guest: "Niko Omilana", image: "/media/tetr/creators/Creator_Grefg.jpg", instagram: "DXrnwFmjPtT" },
  { title: "He'll go to 7 countries for free?", guest: "Aburob", image: "/media/tetr/creators/Creator_Aburob_Refresh.jpg", instagram: "DRYQyA3CbT3" },
];

/* ───────────────────────────── Immersions ───────────────────────────── */

export const immersionsHeading = {
  titleA: "Some Students Read About Emirates and Ferrari,",
  titleB: "You'll Walk Through Their Doors",
  body: "In every country you live in, you'll go inside the businesses that define it: **Emirates** in Dubai, the **Tesla Gigafactory** in Shanghai, **Google** in the US, and **Zomato** in India. Then you'll step into the local markets and traditions that shape how people there actually buy.",
};

const im = (f: string) => `/img/immersions/${f}`;
export const immersions: {
  name: string;
  accent: string;
  tag: string;
  bg: string;
  notes: { kind: "business" | "cultural"; title: string; desc: string }[];
  images: string[];
}[] = [
  {
    name: "India", accent: "#57B26B", tag: "Term 01 · The Density Test", bg: im("INDIA_BG2.jpg"),
    notes: [
      { kind: "business", title: "ITC", desc: "Explore how ITC balances FMCG, hospitality, and agribusiness." },
      { kind: "cultural", title: "Parliament House Visit", desc: "Step inside the seat of Indian democracy." },
      { kind: "cultural", title: "Taj Mahal", desc: "Witness one of the world's most iconic monuments." },
      { kind: "business", title: "LinkedIn", desc: "Understand how data and platforms shape the future of work." },
    ],
    images: [im("LinkedIn_India.webp"), im("Parliament_India.webp"), im("ITC_India.webp"), im("TajMAhal_Inida.webp")],
  },
  {
    name: "Dubai", accent: "#D9A441", tag: "Term 02 · The Trade Hub", bg: im("DUBAI_BG.webp"),
    notes: [
      { kind: "business", title: "EMAAR", desc: "Learn how iconic developments are built and scaled globally." },
      { kind: "cultural", title: "Gold Souk", desc: "Explore gold trading and craftsmanship in Dubai's iconic market." },
      { kind: "cultural", title: "Desert Safari", desc: "Experience desert adventure and Arabian cultural traditions." },
      { kind: "business", title: "Emirates Innovation Headquarters", desc: "Discover how Emirates prototypes next-generation aviation innovation." },
    ],
    images: [im("Emirates_Dubai.webp"), im("GoldSouk_Dubai.webp"), im("Emaar_Dubai.webp"), im("Desert_Safari_Dubai.webp")],
  },
  {
    name: "China", accent: "#D8443C", tag: "Term 03 · The Factory Floor", bg: im("SHANGHAI_BG.webp"),
    notes: [
      { kind: "cultural", title: "The Great Wall", desc: "Hike the restored section of this global icon with panoramic views." },
      { kind: "business", title: "Tencent HQ", desc: "See how China's super-app ecosystem fuels business and culture." },
      { kind: "cultural", title: "Yu Garden & Old Street", desc: "Discover Ming dynasty heritage and vibrant city life." },
      { kind: "business", title: "Tesla Gigafactory", desc: "Experience cutting-edge EV production and sustainable manufacturing at scale." },
    ],
    images: [im("Tesla_China.webp"), im("Tencent_China.webp"), im("Great_Wall_China.webp"), im("Yu_GArden_China.webp")],
  },
  {
    name: "Ghana", accent: "#57B26B", tag: "Term 04 · The Impact Term", bg: im("Ghana_BG.webp"),
    notes: [
      { kind: "business", title: "Google AI Research Centre", desc: "Explore how AI research is solving Africa's challenges." },
      { kind: "cultural", title: "Safari Valley Eco Park", desc: "Explore wildlife, ecosystems, and eco-tourism in Ghana." },
      { kind: "cultural", title: "Accra Art District", desc: "Experience Ghanaian craftsmanship through batik, ceramics, and Kente." },
      { kind: "business", title: "Coca Cola", desc: "Examine manufacturing and brand strategy at a global FMCG leader." },
    ],
    images: [im("CocalCola_GHana.webp"), im("Safari_Valley_Eco_Park_Ghana.webp"), im("Google_Ghana.webp"), im("Accra_Ghana.webp")],
  },
  {
    name: "United States", accent: "#4E8BD6", tag: "Term 05 · The Software Term", bg: im("US_BG.webp"),
    notes: [
      { kind: "business", title: "Spotify HQ", desc: "Explore how data, algorithms, and storytelling shape the future of audio." },
      { kind: "business", title: "Nasdaq", desc: "See how public markets price ambition, listing by listing." },
      { kind: "cultural", title: "Capitol Hill", desc: "Stand where American policy and power are debated." },
      { kind: "business", title: "JPMorgan Chase", desc: "Understand how global capital moves through markets, deals, and institutions." },
    ],
    images: [im("JP_Morgan_US.webp"), im("NASDAQ_US.webp"), im("Spotify_US.webp"), im("Penatagon_US.webp")],
  },
  {
    name: "Argentina", accent: "#63B6D8", tag: "Term 06 · The Scale Term", bg: im("ARGENTINA_BG.webp"),
    notes: [
      { kind: "business", title: "Grupo Los Grobo", desc: "Understand how agribusiness runs on data, futures, and land at scale." },
      { kind: "cultural", title: "Agricultural Heartland", desc: "Experience gaucho traditions across the pampas that feed the world." },
      { kind: "cultural", title: "La Bombonera", desc: "Feel how football fandom becomes one of Argentina's strongest brands." },
      { kind: "business", title: "Distrito Arcos", desc: "Study how heritage rail arches were rebuilt into retail demand." },
    ],
    images: [im("DisitroArcos_Argentina.webp"), im("AgriculturalHEartland_Argentina.webp"), im("LosgroboGRoup_Argentina.webp"), im("la_bombonera_stadium_Argentina.webp")],
  },
  {
    name: "Europe", accent: "#9B7CD8", tag: "Term 07 · The Premium Term", bg: im("LONDON_BG.webp"),
    notes: [
      { kind: "business", title: "Milan Fashion Week", desc: "Learn why craft, not cost, sets the price of luxury." },
      { kind: "business", title: "Italian Grand Prix", desc: "See how motorsport turns engineering into a global sponsorship engine." },
      { kind: "cultural", title: "Pinacoteca di Brera", desc: "Read centuries of patronage as the original brand economy." },
      { kind: "cultural", title: "Grande Braderie de Lille", desc: "Trade in Europe's largest flea market, street by street." },
    ],
    images: [im("grande_braderie_de_lille_europe.webp"), im("Italian_Grand_Prix_Europe.webp"), im("MilanFashionWeek_Europe.webp"), im("pinacoteca_di_brera_europe.webp")],
  },
];

/* ───────────────────────────── Cohort ───────────────────────────── */

export const cohortHeading = {
  line1: "The People You Travel With Are",
  line2: "Half the Reason to Go",
  byline:
    "Everything changes every term except **the people beside you**. Your classmates include **founders who've already raised venture funding, TEDx speakers, and national-level athletes**. Every pitch, project, and 2am idea gets sharper because of who's in the room.",
};

export const cohortStats = [
  { label: "Cohort", value: "800+", text: "Students" },
  { label: "Reach", value: "70+", text: "Nationalities" },
  { label: "Voices", value: "45+", text: "Languages" },
  { label: "SAT", value: "1490", text: "Average score" },
  { label: "Founders", value: "30%", text: "Ran a business first" },
  { label: "Athletes", value: "10%", text: "National-level" },
];

export const tribe = ["Andrea", "Anuska", "Jeet", "Kayla", "Linda", "Brandon", "Isaac", "Songheon", "Juan"].map((name) => ({
  name,
  image: `/media/tribe/tribe-${name}-${name === "Isaac" ? "v3" : "v2"}.jpg`,
}));

/* ───────────────────────────── Podcast ───────────────────────────── */

export const podcastHeading = {
  line1: "If You’ve Scrolled This Far,",
  line2: "Here’s the Unfiltered Version",
  byline: "**Admissions deep-dives, term wrap-ups, and unfiltered conversations** with the people you'll soon be building alongside.",
};

export type Episode = { title: string; guest: string; image: string; youtube?: string; featured?: boolean };
export const podcastTabs = ["Podcasts", "Admissions", "Term Wrap-Up"] as const;
export const podcasts: Record<(typeof podcastTabs)[number], Episode[]> = {
  Podcasts: [
    { title: "Kevin O’Leary: How to Build a Million-Dollar Business (And Why Most Startups Fail)", guest: "Kevin O'Leary", image: "/media/tetr/podcasts/podcast-kevin-v3.jpg", youtube: "xgKajEQf21c", featured: true },
    { title: "Why rich families stay rich? | Author of Psychology of Money shares wealth secrets | Morgan Housel", guest: "Morgan Housel", image: "/media/tetr/podcasts/podcast-morgan-v3.jpg", youtube: "SFhlibQJvYM" },
    { title: "71 MUST WATCH minutes to think like the top 1% | Bestselling author of Hooked | Nir Eyal", guest: "Nir Eyal", image: "/media/tetr/podcasts/podcast-nir-refresh.jpg", youtube: "VBLkaW9Eb7Y" },
    { title: "This is the dark side of family businesses | Old money secrets spilled in 55 mins", guest: "Daniel G. Van Der Vliet", image: "/media/tetr/podcasts/podcast-daniel-v3.jpg", youtube: "Nydbs4e4Iwo" },
    { title: "In Conversation With David A. Sinclair, Longevity Scientist", guest: "David A. Sinclair", image: "/media/tetr/podcasts/podcast-david-v3.jpg" },
  ],
  Admissions: [
    { title: "Inside Tetr: Admissions & Beyond | Ep 1 ft. Pratham Mittal, Tarun Gangwar & Malvika Khajuria", guest: "Pratham Mittal, Tarun Gangwar & Malvika Khajuria", image: "/media/tetr/admissions/Admissions_InsideTetr.jpg", youtube: "AJjQyEcFMgU", featured: true },
    { title: "What is Tetr College's Masters in Management of Technology programme?", guest: "Tetr College of Business", image: "/media/tetr/admissions/Admissions_MiM.jpg", youtube: "EAvAvOmYRJY" },
    { title: "From Applicants to Insiders: The Student POV", guest: "Tetr Students", image: "/media/tetr/admissions/Admissions_StudentPOV.jpg", youtube: "XlMQ7ySphQA" },
  ],
  "Term Wrap-Up": [],
};

/* ───────────────────────────── Campus ───────────────────────────── */

export const campusHeading = {
  line1: "Your Campus Moves With You,",
  line2: "Home Comes Along Too",
  byline:
    "In every country, you'll have **a base camp to learn in** and **a place to come home to**, with classrooms, co-working spaces, and student residences set up so you can focus on building, not logistics.",
};

export const campusCities = [
  { name: "Dubai", slug: "dubai" },
  { name: "India", slug: "india" },
  { name: "China", slug: "china" },
  { name: "Ghana", slug: "ghana" },
  { name: "United States", slug: "usa" },
  { name: "Argentina", slug: "argentina" },
  { name: "Europe", slug: "europe" },
  { name: "Singapore", slug: "singapore" },
];

export const campusViews = [
  { label: "Campus", slug: "campus" },
  { label: "Common Areas", slug: "common-areas" },
  { label: "Room", slug: "room" },
  { label: "Reception", slug: "reception" },
  { label: "Amenities", slug: "amenities" },
  { label: "Outdoors", slug: "outdoors" },
  { label: "Dining", slug: "dining" },
];

/** Views with no photo in the reference (they render disabled). */
export const campusMissing = new Set(["usa-campus", "argentina-campus"]);
export const campusPhoto = (city: string, view: string) =>
  campusMissing.has(`${city}-${view}`) ? null : `/media/tetr/homes/${city}-${view}.jpg`;

/* ───────────────────────────── Press ───────────────────────────── */

export const pressHeading = { line1: "The World's Paying Attention,", line2: "Here's What They're Saying" };

export const press = [
  ["Forbes India", "press-forbes-india"],
  ["Clarín", "press-clarin"],
  ["Hankyung", "press-hankyung"],
  ["Thailand Reporter", "press-thailand-reporter"],
  ["ICT Japan", "press-ict-japan"],
  ["European Business Magazine", "press-european-business"],
  ["Grit Daily", "press-grit-daily"],
  ["Authority Magazine", "press-authority"],
  ["aprendemas", "press-aprendemas"],
  ["CNN Brasil", "press-cnn-brasil"],
].map(([name, f]) => ({ name, image: `/media/press/${f}.jpg` }));

/* ───────────────────────────── Events ───────────────────────────── */

export const eventsHeading = { line1: "Can't Wait to See It for Yourself?", line2: "Come Meet Us" };

export const events: {
  title: string;
  desc: string;
  image: string;
  time: string;
  date: string;
  place: string;
  status: "Offline" | "Online" | "Past Event";
}[] = [
  { title: "TETR Connect: Mexico City Edition", desc: "Spend a day discovering what life at Tetr feels like. Engage with our team, explore our immersive 7-country curriculum, and experience how learning by doing shapes builders.", image: "/media/tetr/events/event-connect.jpg", time: "03:00 PM - 05:00 PM (GST)", date: "Sat, Jan 24, 2026", place: "TBD", status: "Offline" },
  { title: "IFG x Tetr Business Competition", desc: "The IFG x Tetr Global Business Challenge is a multi-stage competition for Grade 11 and 12 students. Tackle real-world challenges and compete against top students worldwide.", image: "/media/tetr/events/event-ifg.jpg", time: "01:00 PM - 02:45 PM (GST)", date: "Tue, Jul 21, 2026", place: "Online + Grand Finale", status: "Online" },
  { title: "The Psychology of Persuasion", desc: "How to influence decisions — a masterclass with Karyn Suarez, Professor at EAE Business School, ex-Les Roches and ex-MTV Latin America.", image: "/media/tetr/events/event-persuasion.jpg", time: "03:00 PM - 04:30 PM (GMT)", date: "Fri, Jun 26, 2026", place: "Online", status: "Past Event" },
  { title: "How to Find Your Career IKIGAI", desc: "Franco Gandolfi — ex-Cornell University, 25+ years of experience, mentored 10K+ leaders globally — on finding work that fits who you are.", image: "/media/tetr/events/event-ikigai.jpg", time: "02:00 PM - 04:00 PM (GMT)", date: "Wed, Jun 17, 2026", place: "Online", status: "Past Event" },
  { title: "How to Build a Brand People Choose", desc: "The businesses that win aren't always the ones with the best products. They're the ones people remember. With Maya Moussly, Personal Brand Strategist.", image: "/media/tetr/events/event-brand.jpg", time: "03:00 PM - 04:00 PM (GST)", date: "Thu, Aug 6, 2026", place: "Online", status: "Past Event" },
  { title: "Organisational Structure Webinar", desc: "Before you build a company, you need to know how to build the team behind it. Learn how successful organisations structure people, roles and decision-making.", image: "/media/tetr/events/event-org.jpg", time: "03:00 PM - 04:00 PM (GST)", date: "Fri, Jul 31, 2026", place: "Online", status: "Past Event" },
];
export const eventsLink = "https://tetr.com/events";

/* ───────────────────────────── Apply ───────────────────────────── */

export const apply = {
  lines: ["The World Is Your Classroom,", "Your Business Is the Coursework,"],
  accent: "Ready to Start?",
  image: "/media/tetr/hero/scholarships-bg.png",
  imageAlt: "Tetr students talking on the campus lawn",
  primary: { label: "Begin Your Application", href: "https://tetr.com/apply" },
  secondary: { label: "Talk to Admissions", href: "https://tetr.com/contact-us" },
  /** Round 1 closes 15 Oct 2026, end of day IST */
  deadline: "2026-10-15T23:59:59+05:30",
  deadlineLabel: "Round 1 closes in",
};

/* ───────────────────────────── Footer ───────────────────────────── */

export const footer = {
  apply: { label: "APPLY NOW", href: "https://tetr.com/apply-now" },
  columns: [
    { label: "Company", links: [
      { label: "About", href: "https://tetr.com/about" },
      { label: "Faculty", href: "https://tetr.com/faculty" },
      { label: "Blog", href: "https://tetr.com/blog" },
      { label: "Events", href: "https://tetr.com/events" },
    ] },
    { label: "Resources", links: [
      { label: "Resources", href: "https://tetr.com/resources" },
      { label: "News", href: "https://tetr.com/events" },
      { label: "Reviews", href: "https://tetr.com/student-life" },
      { label: "Career Labs", href: "https://tetr.com/careers" },
    ] },
    { label: "Reports", links: [
      { label: "Dropshipping Report", href: "https://online.flippingbook.com/view/631102570/" },
      { label: "D2C Brochure", href: "https://online.flippingbook.com/view/1009456202/" },
      { label: "UG Brochure", href: "https://online.flippingbook.com/view/874446259/2/" },
      { label: "PG Brochure", href: "https://online.flippingbook.com/view/633252028/" },
    ] },
    { label: "Experiences", links: [
      { label: "Experiences at Tetr", href: "https://tetr.com/experiences-at-tetr" },
      { label: "Kickstarter", href: "https://tetr.com/kickstarter" },
      { label: "Dropshipping", href: "https://tetr.com/dropshipping" },
      { label: "Student Entrepreneurship", href: "https://tetr.com/entrepreneurship" },
    ] },
  ],
  social: {
    instagram: "https://www.instagram.com/tetr.college/",
    youtube: "https://www.youtube.com/@tetrcollege",
    linkedin: "https://www.linkedin.com/school/tetr-college-of-business/posts/?feedView=all",
  },
  email: "info@tetr.org",
  stores: [
    { label: "Get it on Google Play", href: "https://play.google.com/store/apps/details?id=com.tetr", badge: "/media/stores/google-play.svg" },
    { label: "Download on the App Store", href: "https://apps.apple.com/in/app/tetr/id6756342725", badge: "/media/stores/app-store.svg" },
  ],
  legal: [
    { label: "CONTACT US", href: "https://tetr.com/contact-us" },
    { label: "REFUND POLICY", href: "https://tetr.com/refund-policy" },
    { label: "PRIVACY POLICY", href: "https://tetr.com/privacy-policy" },
    { label: "TERMS & CONDITIONS", href: "https://tetr.com/terms-conditions" },
  ],
  copyright: "COPYRIGHT© 2026 TETR COLLEGE OF BUSINESS. ALL RIGHTS RESERVED.",
};
