/**
 * Starter content for everything editable in the admin. `pnpm db:seed` copies
 * it into MongoDB (never overwriting edits), and the site falls back to it when
 * the database is empty or unreachable (e.g. a CI build), so pages always render.
 *
 * Keep this file free of "@/" imports: the seed script runs it with plain Node.
 */

export const HOME_DEFAULTS = {
  heroEyebrow: "Study abroad counselling · Kathmandu",
  heroTitle: "Your study abroad journey, handled in *detail.*",
  heroSubtitle: "From your first question in Kathmandu to your first campus day.",
  heroPrimaryCta: "Speak with us",
  heroSecondaryCta: "Explore destinations",
  heroNote: "Free first session, students & parents welcome",
  mapCardTitle: "Big dreams. A clear next step.",
  mapCardText: "A world of possibility awaits.",
  stats: [
    { value: "06", line1: "Study", line2: "destinations" },
    { value: "04", line1: "Test prep", line2: "programmes" },
    { value: "05", line1: "Clear steps", line2: "to your offer" },
    { value: "01", line1: "Dedicated", line2: "counsellor" },
  ],
  destTitle: "Find your place in the",
  destTitleAccent: "world.",
  destIntro:
    "Handpicked global study destinations tailored to your academic dreams, post-study work ambitions, and family investment.",
  processTitleBefore: "A big move. Five",
  processTitleHighlight: "quiet, confident",
  processTitleAfter: "steps.",
  processIntro:
    "No rushing, no pushing. Thorough preparation with one dedicated counsellor from start to finish.",
  trustPoints: [
    "Dedicated 1-on-1 advisor",
    "Transparent fee structure",
    "Direct university liaisons",
    "Real-time application tracking",
  ],
  aboutTitle: "Your future deserves personal attention.",
  aboutPoints: [
    {
      title: "Advice that starts with you",
      body: "Your goals, your budget, your pace. Never a one-size-fits-all recommendation.",
    },
    {
      title: "Honest answers. No surprises.",
      body: "True living costs, conditions and total fees, clear before you commit.",
    },
    {
      title: "Care for the whole family",
      body: "A respectful space for parents to ask questions and feel confident together.",
    },
    {
      title: "Every detail, followed through",
      body: "From applications and visa mocks to your accommodation checklist, you know what comes next.",
    },
  ],
  testprepTitle: "Targeted score prep, taught in intimate cohorts.",
  testprepIntro:
    "Test preparation in Putalisadak, capped at 8 to 10 students per cohort. No crowded lecture halls. Daily writing critiques, one-on-one speaking drills and real computer-lab mocks with senior score mentors.",
  diagnosticTitle: "Not sure whether IELTS or PTE fits your visa timeline?",
  diagnosticText:
    "Take our free 30-minute diagnostic in Putalisadak. We assess speaking clarity and reading speed, then give an honest recommendation before you spend on tuition.",
  diagnosticCta: "Book free diagnostic",
  journalKicker: "The Detail Journal / Admissions & Visa Insights",
  journalTitle: "Quiet analysis, candid guides.",
  journalIntro:
    "Field notes from our counsellors on student visas, university intakes, living budgets, and scholarship essays.",
  partnersKicker: "Partner institutions",
  partnersTitle: "We work directly with universities you know.",
  visasKicker: "Visa success",
  visasTitle: "Visas granted. Journeys begun.",
  visasIntro: "A few of the students who recently received their study visas with our guidance.",
  storiesKicker: "Student voices",
  storiesTitle: "Big journeys. Personal stories.",
  consultTitle: "Your next chapter starts here.",
  consultIntro:
    "Tell us a little about yourself. We'll help you make sense of your options, deadlines and scholarships, without pressure.",
  visitTitle: "A warm welcome, right here in Kathmandu.",
  visitText: "Visit with your questions, and your family.",
  seoTitle: "DETAIL Education Consultancy | Kathmandu, Nepal",
  seoDescription:
    "Study abroad guidance from Kathmandu: destinations, test prep, SOPs and visas, handled in detail by one dedicated counsellor.",
}

export const BUSINESS_DEFAULTS = {
  name: "Detail Education Consultancy",
  tagline:
    "Thoughtful guidance. A world of possibilities. Helping ambitious Nepali students reach top-tier global education.",
  // TODO before launch: replace the placeholder WhatsApp number.
  whatsappNumber: "9779800000000",
  phone: "",
  email: "",
  address: "Putalisadak (opposite Star Mall), Kathmandu, Nepal",
  hours: "Sunday to Friday, 9:30 AM to 5:30 PM",
  mapUrl: null as string | null,
  facebook: null as string | null,
  instagram: null as string | null,
  youtube: null as string | null,
  tiktok: null as string | null,
  linkedin: null as string | null,
}

export const ABOUT_DEFAULTS = {
  heroBadge: "Study abroad counselling in Putalisadak",
  heroTitle: "Big moves are made *of small details.*",
  heroIntro:
    "Detail helps Nepali students and their families choose a university, prepare applications and visas, and arrive ready, with one counsellor beside them the whole way.",
  heroNote: "Free first session, families welcome",
  heroImage: "/images/about-student-cutout.png" as string | null,
  ledgerCaption: "Some of what we check, for every student",
  ledger: [
    "Your first conversation, unhurried",
    "Your budget, in rupees",
    "Which intake you can realistically make",
    "IELTS or PTE, for your timeline",
    "Test booking dates",
    "Transcripts and character certificates",
    "Equivalence letters",
    "Every SOP draft, line by line",
    "Recommendation letters",
    "Gap year explanations",
    "Application deadlines",
    "Scholarship cut-offs",
    "Offer letter conditions",
    "Tuition deposit receipts",
    "Bank statement dates",
    "Education loan papers",
    "Sponsor relationship documents",
    "CA valuation report",
    "Tax clearance",
    "Genuine student statement",
    "Visa mock interviews",
    "Biometrics appointment",
    "Health insurance cover",
    "Medical check-up",
    "Accommodation shortlist",
    "Whether the bond is refundable",
    "NOC from the Ministry of Education",
    "Forex for the first months",
    "Flight dates around enrolment",
    "Baggage allowance",
    "Airport pickup",
    "A contact already on campus",
    "Your parents' questions, all of them",
  ],
  storyTitle: "Why we keep the office small",
  storyBody:
    "Detail began with a simple observation: most students leaving Kathmandu to study abroad aren't short of options. They're short of someone who will sit with them long enough to make sense of those options.\n\nSo we kept the office small. Each student works with one counsellor from the first conversation to the day they fly, and that counsellor knows their file, their deadlines and their family. Our test prep classes stay at 8 to 10 students for the same reason.\n\nWe don't push a country, a university or a loan. We explain what each choice really costs, what it leads to and what could go wrong, then help you follow through on the one you choose.",
  ceoHeading: "A message from our CEO",
  ceoGreeting: "Dear students and parents,",
  ceoMessage:
    "Choosing to study abroad is one of the biggest decisions a family makes. It involves money saved over years, hopes for the future, and a lot of questions that deserve honest answers.\n\nWe started Detail to give those questions the time they need. Every student who walks into our office in Putalisadak works with one counsellor, from the first conversation to the day they fly.\n\nWe won't promise you a visa, and we won't steer you towards a university because it suits us. What we promise is clear advice, careful paperwork and someone to call whenever you need help.\n\nThank you for trusting us with your next step.",
  ceoSignoff: "With warm regards,",
  ceoName: "[CEO name]",
  ceoRole: "Founder & CEO, Detail Education Consultancy",
  ceoPhoto: null as string | null,
  principlesTitle: "How we work with you",
  principles: [
    {
      title: "One counsellor, start to finish",
      body: "You won't be passed between desks. The person who hears your goals is the person who checks your visa file.",
    },
    {
      title: "The full cost, up front",
      body: "Tuition, living costs, deposits and our own fees, written down before you commit to anything.",
    },
    {
      title: "Parents in the room",
      body: "Families are welcome at every meeting, with as much time for their questions as for yours.",
    },
    {
      title: "Your words in your SOP",
      body: "We help you shape your statement. We never write it for you or hand you a template.",
    },
  ],
  teamTitle: "The people you'll work with",
  teamIntro: "A small team, so you always know who is looking after your file.",
  visitTitle: "Come and talk it through",
  visitText:
    "Bring your questions, any documents you already have, and your family. The first session is free.",
  visitCta: "Book free counselling",
  seoTitle: "About us",
  seoDescription:
    "Detail is a small study abroad consultancy in Putalisadak, Kathmandu, where one counsellor handles every detail of your application, visa and departure.",
}

export const PRIVACY_DEFAULTS = {
  title: "Privacy policy",
  body: "_This policy has not been written yet. Edit it in Admin → Pages → Privacy policy before launch._",
}

export const TERMS_DEFAULTS = {
  title: "Terms & conditions",
  body: "_These terms have not been written yet. Edit them in Admin → Pages → Terms & conditions before launch._",
}

/** Seed rows for CMS collections (upserted by slug or name). */

export const SEED_SERVICES = [
  {
    slug: "listening-first",
    title: "Listening first",
    stage: "Start",
    summary: "An unhurried session about your aspirations, budget and expectations.",
    linkLabel: "Discovery & goals",
    order: 1,
    published: true,
  },
  {
    slug: "curated-selection",
    title: "Curated selection",
    stage: "Stage",
    summary: "Realistic and reach universities where your degree carries real value.",
    linkLabel: "University match",
    order: 2,
    published: true,
  },
  {
    slug: "sop-narrative",
    title: "SOP & narrative",
    stage: "Craft",
    summary: "Authentic, original personal statements. No cookie-cutter templates.",
    linkLabel: "Authentic dossier",
    order: 3,
    published: true,
  },
  {
    slug: "visa-precision",
    title: "Visa precision",
    stage: "Check",
    summary:
      "Detailed financial review and genuine mock interviews, so there are no surprises.",
    linkLabel: "Embassies & finances",
    order: 4,
    published: true,
  },
  {
    slug: "departure-care",
    title: "Departure care",
    stage: "Offer",
    summary: "Pre-flight briefings, housing checks and alumni already on campus.",
    linkLabel: "Liftoff & arrival",
    order: 5,
    published: true,
  },
]

export const SEED_COURSES = [
  {
    slug: "ielts",
    name: "IELTS",
    tag: "Academic & UKVI",
    summary:
      "Task 2 essay architecture and daily audio recordings, aiming for Speaking band 7.5+.",
    points: [
      "1-on-1 speaking clinics",
      "Cambridge past-test archive",
      "7:00 AM or 5:00 PM",
    ],
    duration: "4 weeks",
    fee: null,
    order: 1,
    published: true,
  },
  {
    slug: "pte",
    name: "PTE",
    tag: "Pearson Academic",
    summary:
      "Pearson-standard lab stations calibrated to pronunciation and oral-fluency scoring.",
    points: [
      "Dedicated lab workstations",
      "Pronunciation pitch analysis",
      "8:00 AM or 1:00 PM",
    ],
    duration: "3 to 4 weeks",
    fee: null,
    order: 2,
    published: true,
  },
  {
    slug: "toefl",
    name: "TOEFL",
    tag: "iBT, new format",
    summary:
      "For North American institutions: condensed academic listening and discussion tasks.",
    points: ["ETS diagnostic metrics", "Note-taking drills", "Flexible 9:30 AM slots"],
    duration: "5 weeks",
    fee: null,
    order: 3,
    published: true,
  },
  {
    slug: "sat",
    name: "SAT",
    tag: "Digital adaptive",
    summary:
      "Scholarship prep targeting 1450+, with Desmos fluency and hard-module mastery.",
    points: [
      "Calculator speed strategies",
      "Hard-module question banks",
      "Weekend & weekday tracks",
    ],
    duration: "6 to 8 weeks",
    fee: null,
    order: 4,
    published: true,
  },
]

/** From the design. Marked unverified, so the site shows the "illustrative" note. */
export const SEED_TESTIMONIALS = [
  {
    name: "Anisha S.",
    role: "Master's student, Australia",
    quote:
      "I didn't need someone to decide for me. I needed someone to help me see my options clearly. Detail made every next step feel manageable.",
    photo: null,
    verified: false,
    order: 1,
    published: true,
  },
  {
    name: "Saurav K.",
    role: "Undergraduate, Canada",
    quote:
      "From choosing a course to preparing my documents, I always knew what was happening. Having one person to turn to made all the difference.",
    photo: null,
    verified: false,
    order: 2,
    published: true,
  },
  {
    name: "Prakriti R.",
    role: "Master's student, United Kingdom",
    quote:
      "My parents had as many questions as I did. The team took time with all of us, and we felt confident about the journey ahead without pressure.",
    photo: null,
    verified: false,
    order: 3,
    published: true,
  },
  {
    name: "Bibek T.",
    role: "MS Computer Science, USA",
    quote:
      "The SOP review sessions were extraordinarily thorough. They pushed me to articulate my genuine research ideas rather than writing generic essays.",
    photo: null,
    verified: false,
    order: 4,
    published: true,
  },
  {
    name: "Shreya M.",
    role: "B.Sc. Mechanical Eng, Germany",
    quote:
      "Navigating German public university deadlines felt overwhelming until I sat down with Detail. Clear steps, realistic timelines, zero anxiety.",
    photo: null,
    verified: false,
    order: 5,
    published: true,
  },
]

/** Sample partner institutions. Replace with your real agreements before launch. */
export const SEED_PARTNERS = [
  { name: "University of Sydney", country: "Australia", order: 1 },
  { name: "Monash University", country: "Australia", order: 2 },
  { name: "Deakin University", country: "Australia", order: 3 },
  { name: "University of Manchester", country: "United Kingdom", order: 4 },
  { name: "Coventry University", country: "United Kingdom", order: 5 },
  { name: "University of Hertfordshire", country: "United Kingdom", order: 6 },
  { name: "Arizona State University", country: "USA", order: 7 },
  { name: "University of Toronto", country: "Canada", order: 8 },
].map((p) => ({ ...p, logo: null, website: null, published: true }))

/** Sample visa wins using placeholder photos. Replace with real, consented student photos. */
export const SEED_VISA_SUCCESSES = [
  { name: "Anisha S.", country: "Australia", university: "Monash University", intake: "Feb 2026", photo: "/images/dest-australia.jpg" },
  { name: "Rohan K.", country: "United Kingdom", university: "Coventry University", intake: "Jan 2026", photo: "/images/dest-uk.jpg" },
  { name: "Sujata T.", country: "USA", university: "Arizona State University", intake: "Fall 2025", photo: "/images/dest-usa.jpg" },
  { name: "Bikash G.", country: "Australia", university: "Deakin University", intake: "Jul 2025", photo: "/images/dest-australia.jpg" },
].map((v, i) => ({ ...v, order: i + 1, published: true }))

export const SEED_TEAM = [
  {
    name: "Rina Mishra",
    title: "Senior Academic Advisor & Alum",
    bio: "",
    quote: "Good advice begins with a real conversation, never a sales pitch.",
    yearsExperience: 8,
    photo: null,
    featured: true,
    order: 1,
    published: true,
  },
]

export { SEED_ARTICLES } from "./seed-articles.ts"
