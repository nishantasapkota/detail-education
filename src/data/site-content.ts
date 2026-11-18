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
  heroPrimaryCta: "Book free counselling",
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
  processIntro: "No rushing, no pushing. Thorough preparation with one dedicated counsellor from start to finish.",
  trustPoints: [
    "Dedicated 1-on-1 advisor",
    "Transparent fee structure",
    "Direct university liaisons",
    "Real-time application tracking",
  ],
  aboutTitle: "Your future deserves personal attention.",
  aboutPoints: [
    { title: "Advice that starts with you", body: "Your goals, your budget, your pace. Never a one-size-fits-all recommendation." },
    { title: "Honest answers. No surprises.", body: "True living costs, conditions and total fees, clear before you commit." },
    { title: "Care for the whole family", body: "A respectful space for parents to ask questions and feel confident together." },
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
  journalIntro: "Field notes from our counsellors on student visas, university intakes, living budgets, and scholarship essays.",
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
  tagline: "Thoughtful guidance. A world of possibilities. Helping ambitious Nepali students reach top-tier global education.",
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
  { slug: "listening-first", title: "Listening first", stage: "Start", summary: "An unhurried session about your aspirations, budget and expectations.", linkLabel: "Discovery & goals", order: 1, published: true },
  { slug: "curated-selection", title: "Curated selection", stage: "Stage", summary: "Realistic and reach universities where your degree carries real value.", linkLabel: "University match", order: 2, published: true },
  { slug: "sop-narrative", title: "SOP & narrative", stage: "Craft", summary: "Authentic, original personal statements. No cookie-cutter templates.", linkLabel: "Authentic dossier", order: 3, published: true },
  { slug: "visa-precision", title: "Visa precision", stage: "Check", summary: "Detailed financial review and genuine mock interviews, so there are no surprises.", linkLabel: "Embassies & finances", order: 4, published: true },
  { slug: "departure-care", title: "Departure care", stage: "Offer", summary: "Pre-flight briefings, housing checks and alumni already on campus.", linkLabel: "Liftoff & arrival", order: 5, published: true },
]

export const SEED_COURSES = [
  { slug: "ielts", name: "IELTS", tag: "Academic & UKVI", summary: "Task 2 essay architecture and daily audio recordings, aiming for Speaking band 7.5+.", points: ["1-on-1 speaking clinics", "Cambridge past-test archive", "7:00 AM or 5:00 PM"], duration: "4 weeks", fee: null, order: 1, published: true },
  { slug: "pte", name: "PTE", tag: "Pearson Academic", summary: "Pearson-standard lab stations calibrated to pronunciation and oral-fluency scoring.", points: ["Dedicated lab workstations", "Pronunciation pitch analysis", "8:00 AM or 1:00 PM"], duration: "3 to 4 weeks", fee: null, order: 2, published: true },
  { slug: "toefl", name: "TOEFL", tag: "iBT, new format", summary: "For North American institutions: condensed academic listening and discussion tasks.", points: ["ETS diagnostic metrics", "Note-taking drills", "Flexible 9:30 AM slots"], duration: "5 weeks", fee: null, order: 3, published: true },
  { slug: "sat", name: "SAT", tag: "Digital adaptive", summary: "Scholarship prep targeting 1450+, with Desmos fluency and hard-module mastery.", points: ["Calculator speed strategies", "Hard-module question banks", "Weekend & weekday tracks"], duration: "6 to 8 weeks", fee: null, order: 4, published: true },
]

/** From the design. Marked unverified, so the site shows the "illustrative" note. */
export const SEED_TESTIMONIALS = [
  { name: "Anisha S.", role: "Master's student, Australia", quote: "I didn't need someone to decide for me. I needed someone to help me see my options clearly. Detail made every next step feel manageable.", photo: null, verified: false, order: 1, published: true },
  { name: "Saurav K.", role: "Undergraduate, Canada", quote: "From choosing a course to preparing my documents, I always knew what was happening. Having one person to turn to made all the difference.", photo: null, verified: false, order: 2, published: true },
  { name: "Prakriti R.", role: "Master's student, United Kingdom", quote: "My parents had as many questions as I did. The team took time with all of us, and we felt confident about the journey ahead without pressure.", photo: null, verified: false, order: 3, published: true },
  { name: "Bibek T.", role: "MS Computer Science, USA", quote: "The SOP review sessions were extraordinarily thorough. They pushed me to articulate my genuine research ideas rather than writing generic essays.", photo: null, verified: false, order: 4, published: true },
  { name: "Shreya M.", role: "B.Sc. Mechanical Eng, Germany", quote: "Navigating German public university deadlines felt overwhelming until I sat down with Detail. Clear steps, realistic timelines, zero anxiety.", photo: null, verified: false, order: 5, published: true },
]

export const SEED_TEAM = [
  { name: "Rina Mishra", title: "Senior Academic Advisor & Alum", bio: "", quote: "Good advice begins with a real conversation, never a sales pitch.", yearsExperience: 8, photo: null, featured: true, order: 1, published: true },
]

export { SEED_ARTICLES } from "./seed-articles.ts"
