/**
 * Sample journal articles so the site has content out of the box.
 * They give general guidance only and deliberately avoid exact visa figures,
 * which change often. Review and edit them in Admin → Journal before launch.
 *
 * Load or refresh them with: pnpm db:seed --articles
 */

const day = (iso: string) => new Date(`${iso}T09:00:00+05:45`)

export const SEED_ARTICLES = [
  {
    slug: "post-study-work-visas-uk-canada-australia",
    title: "Post-study work in the UK, Canada and Australia: how to compare the routes",
    category: "Visa Strategy",
    excerpt:
      "What to look at beyond the headline number of years: eligibility, course rules, cost and what the route actually leads to.",
    coverImage: "/images/dest-uk.jpg",
    author: "Rina Mishra",
    readMinutes: 6,
    featured: true,
    publishedAt: day("2026-11-10"),
    body: `For many Nepali families, the right to work after graduation matters as much as the degree. It helps repay the investment and gives real international experience. But comparing countries by "how many years" alone can mislead you.

## Four questions to ask about any post-study route

1. **Who qualifies?** Some routes depend on the level of study, the length of the course, or the type of institution.
2. **Does your course count?** Rules can differ by programme, field of study or delivery mode (for example online vs on campus).
3. **What does it cost?** Look at the application fee, health charges and the money you need to show.
4. **Where does it lead?** Some routes are a stepping stone to longer-term work visas; others simply end.

## The UK

The UK Graduate Route lets students who complete an eligible degree stay and work for a set period without a job offer. It is simple to apply for, but the length has been under review, so **always check the current rules on the official UK government site** before you plan around it.

## Canada

Canada's Post-Graduation Work Permit is tied closely to the programme you study: its length, the institution and, more recently, the field of study. Choosing the right *programme* matters as much as choosing the right university.

## Australia

Australia offers a Temporary Graduate visa whose length depends on your qualification. Studying in some regional areas has historically offered extra options.

## Our advice

- Treat post-study work as **one factor**, not the only one.
- Pick a course you would value **even if the rules changed**.
- Re-check the official rules at three moments: when you shortlist, when you accept an offer, and before you graduate.

> Rules change often. Book a session and we will walk you through what applies to your exact course today.`,
  },
  {
    slug: "what-admissions-committees-look-for-in-an-sop",
    title: "What admissions committees actually look for in an SOP (and 4 clichés to delete)",
    category: "Admissions & SOP",
    excerpt:
      "An SOP is not a biography. Here is what readers look for, and the four phrases that make strong applicants sound like everyone else.",
    coverImage: "/images/dest-usa.jpg",
    author: "Detail Admissions Desk",
    readMinutes: 8,
    featured: true,
    publishedAt: day("2026-10-28"),
    body: `A Statement of Purpose answers one question for a busy reader: **why this course, why you, and why now?** Everything in it should serve that answer.

## What readers look for

- **A clear direction.** What do you want to learn, and what do you plan to do with it?
- **Evidence, not adjectives.** "I am passionate about data" says little. "I cleaned and analysed three years of my family shop's sales to plan stock" says a lot.
- **Fit with the programme.** Name specific modules, labs or teaching approaches, and say why they matter to *you*.
- **Honest reflection.** A gap year, a low mark or a change of field is fine if you explain what you learned.

## Four clichés to delete

1. **"Since childhood I have been fascinated by…"** Start with something you actually did instead.
2. **"World-renowned university with state-of-the-art facilities."** They know. Tell them which part fits your goals.
3. **"I am a hardworking and dedicated person."** Show it with one concrete example.
4. **Quotes from famous people.** Your own words are more convincing.

## A simple structure that works

1. A specific moment or problem that started your interest.
2. What you have done since: study, projects, work.
3. What you want to learn next, and why this programme.
4. Where you want to be in five years, and how this degree gets you there.

## Before you submit

Read it aloud. Cut every sentence that could appear in someone else's SOP. Then ask someone who knows you whether it *sounds* like you.

> Our counsellors review SOPs line by line, but we never write them for you. Authenticity is the point.`,
  },
  {
    slug: "cost-of-living-melbourne-vs-manchester",
    title: "Budgeting for life abroad: how to plan your first year in Melbourne or Manchester",
    category: "Cost of Living",
    excerpt:
      "A practical way to estimate rent, food, transport and settling-in costs, and how much to keep aside before part-time work starts.",
    coverImage: "/images/dest-australia.jpg",
    author: "Student Care Team",
    readMinutes: 5,
    featured: true,
    publishedAt: day("2026-10-15"),
    body: `Tuition is only part of the cost. Families are most often surprised by rent, deposits and the first few weeks before any income arrives.

## Build your budget in four parts

| Cost | What to include |
| --- | --- |
| **Housing** | Weekly rent, bond or deposit, utilities, internet |
| **Daily life** | Groceries, phone plan, toiletries, a little eating out |
| **Transport** | Student travel card or monthly pass |
| **Settling in** | Bedding, kitchen basics, winter clothing, first-week taxis |

## Melbourne vs Manchester: what differs

- **Rent is usually the biggest line in both cities.** Shared housing a short commute from campus is often the best value.
- **Winter matters in Manchester.** Budget for heating and a proper coat in your first month.
- **Transport passes differ.** Check student concession cards as soon as you enrol.

## Plan for a buffer

Part-time work takes time to find, and the hours you may work are limited by your visa. Arrive with enough money to cover **at least your first two to three months** without relying on a job.

## A simple monthly check

1. Write down every cost for your first month.
2. Compare it to your plan.
3. Adjust before small overspends become a habit.

> We give every student a pre-departure checklist and a budget template. Ask your counsellor for one.`,
  },
  {
    slug: "finding-scholarships-as-a-nepali-student",
    title: "Finding scholarships as a Nepali student: where to look and when to apply",
    category: "Scholarships",
    excerpt:
      "Most scholarships are won months before the deadline. A simple timeline, the main types of funding, and how to stand out.",
    coverImage: "/images/dest-uk.jpg",
    author: "Rina Mishra",
    readMinutes: 6,
    featured: false,
    publishedAt: day("2026-09-30"),
    body: `Scholarships reward preparation more than luck. The students who win them usually start early and apply widely.

## Types of funding

- **University scholarships:** often automatic or based on your application. Some need a separate essay.
- **Government scholarships:** competitive, prestigious, and usually with early deadlines.
- **Department awards:** smaller, but with fewer applicants.
- **Tuition discounts:** not called scholarships, but they cut the real cost.

## A 12-month timeline

1. **12 months before:** shortlist countries and courses; note every scholarship deadline.
2. **9 months before:** take your English test; ask for recommendation letters.
3. **6 months before:** write and refine scholarship essays.
4. **3 months before:** follow up on decisions and compare total offers.

## How to stand out

- Tie your goals to **impact back home**, with specifics.
- Keep grades and test scores strong; many awards have a cut-off.
- Tailor every essay. Generic essays are easy to spot.

> We maintain a list of scholarships suited to Nepali applicants. Ask about it in your first session.`,
  },
  {
    slug: "ielts-or-pte-which-test-should-you-take",
    title: "IELTS or PTE? How to choose the right English test for your plans",
    category: "Test Prep",
    excerpt:
      "Both are widely accepted, but they feel very different on test day. How to choose based on your strengths and your target universities.",
    coverImage: "/images/dest-usa.jpg",
    author: "Detail Test Prep Team",
    readMinutes: 4,
    featured: false,
    publishedAt: day("2026-09-12"),
    body: `Choosing the wrong test can cost you time and money. Start with two questions: **what do your universities accept**, and **how do you perform best?**

## Check acceptance first

Most universities in the UK, Australia and Canada accept both, but some programmes, scholarships or visa routes name a specific test. Confirm on each university's page before you book.

## How they feel different

- **IELTS** offers speaking with a real examiner and a mix of paper or computer formats. Some students find a human conversation more natural.
- **PTE** is fully computer-based, including speaking into a microphone. Results usually arrive quickly.

## Which suits you?

- Prefer talking to a person? Consider **IELTS**.
- Comfortable with timed computer tasks and want fast results? Consider **PTE**.
- Not sure? Take a **diagnostic test** for each and compare.

> Our free 30-minute diagnostic in Putalisadak tells you which test suits you before you spend on tuition.`,
  },
  {
    slug: "your-first-month-abroad-checklist",
    title: "Your first month abroad: a calm checklist for week one to week four",
    category: "Student Life",
    excerpt:
      "From airport pickup to your first lecture, a week-by-week list that keeps the first month manageable for students and parents.",
    coverImage: "/images/dest-australia.jpg",
    author: "Student Care Team",
    readMinutes: 5,
    featured: false,
    publishedAt: day("2026-08-25"),
    body: `The first month abroad is exciting and tiring. A simple plan makes it calmer for you and for your family at home.

## Week 1: arrive and settle

- Message home when you land.
- Collect your accommodation keys and check the room.
- Buy a local SIM card.
- Find your nearest supermarket and pharmacy.

## Week 2: get official

- Attend orientation and collect your student ID.
- Open a bank account.
- Register with a doctor if your country requires it.

## Week 3: build a routine

- Set a weekly budget and track it.
- Join one society or club.
- Learn your routes to campus and the library.

## Week 4: look ahead

- Check your timetable and first assessment dates.
- Start looking for part-time work, within your visa limits.
- Call home and share what is going well.

> Our alumni network on campus is there to help. We will connect you before you fly.`,
  },
]
