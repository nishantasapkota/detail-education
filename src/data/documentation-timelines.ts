import type { DocumentationCountryId } from "@/config/documentation"

export type DocumentationStage = {
  timing: string
  title: string
  description: string
  documents: string[]
}

export type DocumentationTimelineData = {
  id: DocumentationCountryId
  name: string
  code: string
  route: string
  targetIntakes: string
  guideTimeline: string
  authority: string
  officialLabel: string
  officialUrl: string
  notes: string[]
  steps: DocumentationStage[]
}

export const DOCUMENTATION_TIMELINES: DocumentationTimelineData[] = [
  {
    id: "japan",
    name: "Japan",
    code: "JP",
    route: "Student visa · COE route",
    targetIntakes: "April / July / October / January",
    guideTimeline: "5-7 months",
    authority: "ISA Japan · VFS Global Kathmandu",
    officialLabel: "Japan Immigration Services Agency",
    officialUrl: "https://www.moj.go.jp/isa/applications/status/student.html",
    notes: [
      "The Certificate of Eligibility is normally valid for 3 months from issue; complete the visa and entry steps within that period.",
      "For language-school applicants from the October 2026 intake, confirm the current A1 Japanese evidence requirements with the school.",
    ],
    steps: [
      {
        timing: "6-7 months before intake",
        title: "School selection & language proof",
        description:
          "Choose a recognised school and intake, then meet its Japanese-language or English-program requirements.",
        documents: [
          "Valid passport",
          "Academic transcripts and certificates",
          "Japanese A1 / JLPT N5 proof or English score",
          "Passport photos and application form",
        ],
      },
      {
        timing: "5-6 months before intake",
        title: "Sponsor & financial dossier",
        description:
          "Prepare sponsor funds and income evidence for the school's COE file. Translate and notarise Nepali documents as needed.",
        documents: [
          "Sponsor bank statements",
          "Sponsor income and tax records",
          "Relationship certificate and sponsorship letter",
          "Certified English translations",
        ],
      },
      {
        timing: "3.5-5 months before intake",
        title: "School review & COE application",
        description:
          "Send the full application to the school. The school reviews the file and applies for your Certificate of Eligibility (COE).",
        documents: [
          "School application package",
          "Sponsor financial dossier",
          "Certificate of Eligibility (COE)",
        ],
      },
      {
        timing: "3-6 weeks before intake",
        title: "Tuition payment & visa filing",
        description:
          "Follow the school's tuition instructions, then book and submit your visa application through VFS Global Kathmandu.",
        documents: [
          "COE",
          "Visa application form and photo",
          "School admission and fee confirmation",
          "Sponsor documents required by VFS",
        ],
      },
      {
        timing: "1-3 weeks before intake",
        title: "Visa decision & arrival in Japan",
        description:
          "The guide estimates 5-10 business days for visa processing. Collect your passport and arrange travel before the COE expires.",
        documents: [
          "Passport with student visa",
          "Flight, accommodation and emergency contacts",
          "Residence card and address registration",
        ],
      },
    ],
  },
  {
    id: "canada",
    name: "Canada",
    code: "CA",
    route: "Study permit · standard stream",
    targetIntakes: "September / January / May",
    guideTimeline: "4-6 months",
    authority: "IRCC online account · VFS Global Kathmandu",
    officialLabel: "Canada study permit documents",
    officialUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html",
    notes: [
      "Most applicants need a PAL/TAL or, for Quebec, a CAQ unless exempt. Include proof of exemption where applicable.",
      "IRCC updates financial thresholds. Check the current amount and source-of-funds evidence before filing.",
    ],
    steps: [
      {
        timing: "5-6 months before intake",
        title: "DLI selection, testing & letter of acceptance",
        description:
          "Shortlist designated learning institutions, check PGWP eligibility if relevant, meet admission requirements and apply.",
        documents: [
          "Valid passport",
          "Academic transcripts and certificates",
          "English score if required",
          "SOP, CV and references if required",
        ],
      },
      {
        timing: "4-5 months before intake",
        title: "PAL/TAL (or CAQ) & financial preparation",
        description:
          "Accept your offer and arrange any required attestation. Compile proof of tuition, living costs and travel funds.",
        documents: [
          "PAL/TAL or Quebec CAQ, or exemption proof",
          "Bank statements, GIC, loan or scholarship proof",
          "Sponsor relationship and income evidence",
        ],
      },
      {
        timing: "3-4 months before intake",
        title: "Online IRCC application & payment",
        description:
          "Apply through your IRCC secure account, upload the complete file in the matching document fields and pay the fees.",
        documents: [
          "Passport copy and digital photos",
          "Letter of acceptance and PAL/TAL or CAQ",
          "Financial and sponsor documents",
          "Letter of explanation",
        ],
      },
      {
        timing: "Within 30 days of the biometrics letter",
        title: "Biometrics, medical & police checks",
        description:
          "After receiving the Biometrics Instruction Letter, complete biometrics within the stated deadline. Complete medical or police checks if requested.",
        documents: [
          "Biometrics Instruction Letter",
          "Valid passport",
          "Medical confirmation if required",
          "Police certificate if requested",
        ],
      },
      {
        timing: "2-6 weeks before intake",
        title: "IRCC decision, passport & travel",
        description:
          "Track your application, respond to requests and submit your passport if asked. Review your travel documents before departure.",
        documents: [
          "IRCC decision and visa / eTA / port-of-entry letter",
          "Valid passport and printed letter of acceptance",
          "Financial and accommodation evidence for travel",
        ],
      },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    code: "UK",
    route: "Student visa · Student route",
    targetIntakes: "September / January / May",
    guideTimeline: "3-5 months",
    authority: "UKVI · VFS Global Kathmandu",
    officialLabel: "GOV.UK student visa documents",
    officialUrl: "https://www.gov.uk/student-visa/documents-you-must-provide",
    notes: [
      "Keep the required funds in the account for 28 consecutive days; the closing statement date must be within 31 days of submission.",
      "From 30 November 2026, the guide lists £1,570/month for London and £1,203/month elsewhere. Check the threshold and fees that apply on your application date.",
    ],
    steps: [
      {
        timing: "4-5 months before intake",
        title: "University application & offer",
        description:
          "Shortlist universities and courses, meet English requirements, and submit your application.",
        documents: [
          "Valid passport",
          "Academic transcripts and certificates",
          "English score or accepted MOI letter",
          "SOP, references and CV if applicable",
        ],
      },
      {
        timing: "3-4 months before intake",
        title: "Maintenance funds & TB test",
        description:
          "Hold the required funds for 28 days and book a UKVI-approved tuberculosis test if required for your application.",
        documents: [
          "28-day bank statement and balance certificate",
          "Parental relationship evidence if applicable",
          "Approved TB certificate if required",
        ],
      },
      {
        timing: "2-3 months before intake",
        title: "Tuition deposit, credibility & CAS",
        description:
          "Meet course conditions, pay the deposit, complete any pre-CAS checks and receive your Confirmation of Acceptance for Studies (CAS).",
        documents: [
          "Offer acceptance form",
          "Tuition deposit receipt",
          "Pre-CAS financial and TB clearance if required",
          "CAS statement and number",
        ],
      },
      {
        timing: "6-10 weeks before intake",
        title: "UKVI application & biometrics",
        description:
          "Apply online, pay the current visa and health surcharge fees, and attend your VFS Global Kathmandu biometrics appointment.",
        documents: [
          "Valid passport and CAS number",
          "Bank statements or loan and parental documents",
          "TB certificate if required",
          "ATAS certificate for applicable courses",
        ],
      },
      {
        timing: "2-5 weeks before intake",
        title: "Decision, eVisa & pre-departure",
        description:
          "The guide estimates around 3 weeks for standard processing or 5 working days for priority. Follow decision instructions and set up your eVisa account.",
        documents: [
          "Decision notice and UKVI account",
          "CAS and accommodation confirmation",
          "Original academic, English and TB certificates for travel",
        ],
      },
    ],
  },
  {
    id: "usa",
    name: "United States",
    code: "US",
    route: "Student visa · F-1",
    targetIntakes: "Fall (Aug/Sep) / Spring (Jan) / Summer",
    guideTimeline: "4-6 months",
    authority: "U.S. Embassy Kathmandu · Maharajgunj",
    officialLabel: "U.S. student visa guidance",
    officialUrl:
      "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
    notes: [
      "Keep names, dates, funding figures and study plans consistent across your I-20, DS-160 and financial documents.",
      "New F-1 students cannot enter the U.S. more than 30 days before the program start date on the I-20.",
    ],
    steps: [
      {
        timing: "5-6 months before intake",
        title: "Shortlisting, testing & application",
        description:
          "Shortlist SEVP-certified schools, complete required English or admission tests, and submit admission and scholarship applications.",
        documents: [
          "Valid passport",
          "Academic transcripts and certificates",
          "Standardised and English test scores if required",
          "SOP, essays and recommendation letters",
        ],
      },
      {
        timing: "3.5-5 months before intake",
        title: "Financial proof & Form I-20",
        description:
          "After admission, prepare sponsor, family or loan evidence for at least the first academic year. The school issues your I-20 after financial clearance.",
        documents: [
          "Bank statements, loan or scholarship letter",
          "Sponsor declaration and relationship proof",
          "Income and tax records",
          "Form I-20",
        ],
      },
      {
        timing: "2-4 months before intake",
        title: "SEVIS fee, DS-160 & visa slot",
        description:
          "Pay the SEVIS I-901 fee, complete the DS-160, pay the visa fee and schedule an interview at the U.S. Embassy Kathmandu.",
        documents: [
          "Signed Form I-20",
          "I-901 SEVIS fee receipt",
          "DS-160 confirmation and photo",
          "Visa fee receipt and appointment letter",
        ],
      },
      {
        timing: "4-10 weeks before intake",
        title: "Interview preparation & embassy interview",
        description:
          "Prepare clear, consistent explanations for your university choice, funding, career plans and ties to Nepal, then attend your F-1 interview.",
        documents: [
          "Passport and signed I-20",
          "DS-160 confirmation and fee receipts",
          "Financial and sponsor documents",
          "Academic transcripts and test scores",
        ],
      },
      {
        timing: "1-5 weeks before intake",
        title: "Visa decision, passport & departure",
        description:
          "Follow the embassy's passport return instructions and arrange travel after the visa decision. Carry your key documents with you.",
        documents: [
          "Stamped passport and Form I-20",
          "SEVIS receipt and financial proof",
          "Housing details and pre-departure checklist",
        ],
      },
    ],
  },
  {
    id: "finland",
    name: "Finland",
    code: "FI",
    route: "Residence permit for studies",
    targetIntakes: "Autumn (Aug/Sep) / Spring (Jan)",
    guideTimeline: "4-6 months",
    authority: "Migri / Enter Finland · VFS Global Kathmandu",
    officialLabel: "Finnish Immigration Service · student permit",
    officialUrl: "https://migri.fi/en/residence-permit-application-for-studies",
    notes: [
      "The guide uses €9,600 for a one-year permit (€800/month), separate from tuition. Funds generally need to be in the student's own account.",
      "Finland issues a residence permit card for studies rather than a traditional visa sticker. Arrange the Nepal MoEST NOC early for foreign remittances.",
    ],
    steps: [
      {
        timing: "5-6 months before intake",
        title: "Application, tests & admission",
        description:
          "Shortlist universities or UAS programmes, meet the English or entrance requirements, apply and receive official acceptance.",
        documents: [
          "Valid passport",
          "Academic transcripts and certificates",
          "English score if required",
          "Motivation letter, CV and references if required",
        ],
      },
      {
        timing: "3.5-5 months before intake",
        title: "NOC, tuition, scholarship & bank funds",
        description:
          "Apply for Nepal's MoEST NOC, confirm tuition or scholarship and settle living funds in the student's own bank account.",
        documents: [
          "Admission certificate",
          "Funds and source-of-funds evidence",
          "Tuition receipt or scholarship proof",
          "MoEST NOC for remittances from Nepal",
        ],
      },
      {
        timing: "2.5-4 months before intake",
        title: "Health insurance & Enter Finland filing",
        description:
          "Arrange private student health insurance and submit the online residence permit application with the required attachments.",
        documents: [
          "Enter Finland application",
          "Health insurance certificate",
          "Bank statement and funds evidence",
          "Passport photo and admission proof",
        ],
      },
      {
        timing: "Within 3 months of filing",
        title: "Biometrics & VFS verification",
        description:
          "Book and attend identity verification and biometrics at VFS Global Kathmandu, bringing originals and copies for checking.",
        documents: [
          "Passport and application confirmation",
          "Original supporting documents and copies",
          "Applicable service or biometric fee",
        ],
      },
      {
        timing: "2-6 weeks before intake",
        title: "Migri decision, permit card & arrival",
        description:
          "Track the application in Enter Finland, respond to requests and arrange travel after the residence permit card is couriered to Kathmandu.",
        documents: [
          "Passport and residence permit card",
          "Admission, insurance and financial evidence",
          "Post-arrival registration documents for DVV",
        ],
      },
    ],
  },
  {
    id: "australia",
    name: "Australia",
    code: "AU",
    route: "Student visa · subclass 500",
    targetIntakes: "February / July / November",
    guideTimeline: "3-5 months",
    authority: "Department of Home Affairs · VFS Global Kathmandu",
    officialLabel: "Australian student visa requirements",
    officialUrl:
      "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    notes: [
      "The guide's living-funds benchmark is AUD 29,710, plus tuition, travel and OSHC. Check the current official amount before applying.",
      "Keep a clear source-of-funds trail and provide English or certified English translations for Nepali documents.",
    ],
    steps: [
      {
        timing: "4-5 months before intake",
        title: "Admission & offer letter",
        description:
          "Shortlist CRICOS courses, complete English testing and submit the university application and any required pre-offer interview.",
        documents: [
          "Valid passport",
          "Academic transcripts and certificates",
          "IELTS / PTE / TOEFL score",
          "SOP and work or study-gap evidence if applicable",
        ],
      },
      {
        timing: "3-4 months before intake",
        title: "Financial & Genuine Student clearance",
        description:
          "Consolidate sponsor funds, verify income sources and prepare clear Genuine Student responses for your course choice and plans.",
        documents: [
          "Bank statements or education loan",
          "Sponsor relationship and income evidence",
          "Tax, business or employment records",
          "Genuine Student responses",
        ],
      },
      {
        timing: "2.5-3 months before intake",
        title: "Tuition deposit & CoE",
        description:
          "Accept the offer, arrange Overseas Student Health Cover (OSHC) and remit the initial tuition deposit so the provider can issue your CoE.",
        documents: [
          "Signed offer acceptance",
          "SWIFT / TT receipt or loan disbursement proof",
          "OSHC policy certificate",
          "Confirmation of Enrolment (CoE)",
        ],
      },
      {
        timing: "6-10 weeks before intake",
        title: "Visa lodgement, biometrics & medicals",
        description:
          "Lodge online through ImmiAccount, book VFS biometrics and complete the panel medical examination when instructed.",
        documents: [
          "CoE and OSHC certificate",
          "Financial, income, relationship and GS dossier",
          "Police clearance if required",
          "HAP ID and passport for medicals / biometrics",
        ],
      },
      {
        timing: "2-6 weeks before intake",
        title: "Visa decision & pre-departure",
        description:
          "The guide estimates 3-8 weeks for higher-education assessment, longer if verification is needed. Review the grant notice and arrange travel.",
        documents: [
          "Visa Grant Notice and passport",
          "CoE and OSHC policy",
          "Original academic and English documents",
          "Accommodation and travel funds",
        ],
      },
    ],
  },
  {
    id: "germany",
    name: "Germany",
    code: "DE",
    route: "National student visa · Category D",
    targetIntakes: "Winter (October) / Summer (April)",
    guideTimeline: "5-8 months",
    authority: "German Embassy Kathmandu · uni-assist",
    officialLabel: "German Federal Foreign Office · student visa",
    officialUrl:
      "https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq/08-studentenvisum-606690",
    notes: [
      "The guide uses a 2026 blocked-account benchmark of €992/month (€11,904/year), plus provider fees. Other financial proofs may apply; confirm current requirements.",
      "Book the embassy appointment early. If your pathway requires a language certificate, bring an accepted certificate to the appointment.",
    ],
    steps: [
      {
        timing: "6-8 months before intake",
        title: "Program choice, language & appointment slot",
        description:
          "Shortlist universities or Studienkolleg, check admission and language rules, join the embassy appointment waiting list and complete language tests.",
        documents: [
          "Passport valid for at least 12 months",
          "Academic transcripts and certificates",
          "Language certificate if required",
          "CV and motivation letter",
        ],
      },
      {
        timing: "5-7 months before intake",
        title: "University application & admission",
        description:
          "Apply directly or through uni-assist, complete any entrance assessments and prepare certified German or English translations.",
        documents: [
          "University application documents",
          "Certified translations",
          "Official letter of admission",
        ],
      },
      {
        timing: "3-5 months before intake",
        title: "Financial proof & blocked account",
        description:
          "Prepare proof of living expenses. A blocked account is one route; scholarship, formal sponsorship or family financial evidence may also apply.",
        documents: [
          "Blocked account confirmation or alternative proof",
          "Scholarship / sponsor / family tax documents",
          "Bank records for transfers from Nepal",
        ],
      },
      {
        timing: "4-10 weeks before intake",
        title: "Embassy appointment & submission",
        description:
          "Attend your scheduled Kathmandu appointment with originals and copies, complete the VIDEX form, provide biometrics and pay the visa fee.",
        documents: [
          "Passport, citizenship and birth certificates",
          "VIDEX form, declaration and photos",
          "Admission, academic and language certificates",
          "CV, motivation letter and financial proof",
        ],
      },
      {
        timing: "2-6 weeks before intake",
        title: "Visa decision, insurance & arrival",
        description:
          "The guide estimates at least 3-4 weeks for embassy processing, longer in peak periods. After approval, arrange insurance and travel.",
        documents: [
          "Passport with national student visa",
          "Health insurance and flight details",
          "Address registration and enrolment documents",
        ],
      },
    ],
  },
]
