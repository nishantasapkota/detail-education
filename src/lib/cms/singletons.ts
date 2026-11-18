import { z } from "zod"

import { optionalText } from "@/lib/cms/fields"
import { defineSingleton, type SingletonDef } from "@/lib/cms/types"

const text = (max: number) => z.string().trim().min(1, "Required").max(max)
const url = () => optionalText(300).pipe(z.url("Enter a full link starting with https://").nullable())

export const home = defineSingleton({
  key: "home",
  title: "Home page",
  description: "Headlines and copy for every section of the home page. Lists (destinations, steps, courses…) have their own screens.",
  permission: "content.manage",
  publicPath: "/",
  cacheTags: ["page-home"],
  schema: z.object({
    heroEyebrow: z.string().trim().max(60).default(""),
    heroTitle: text(120),
    heroSubtitle: text(240),
    heroPrimaryCta: text(40),
    heroSecondaryCta: text(40),
    heroNote: text(100),
    mapCardTitle: text(60),
    mapCardText: text(80),
    stats: z.array(z.object({ value: text(6), line1: text(20), line2: z.string().trim().max(20) })).max(4),
    destTitle: text(60),
    destTitleAccent: z.string().trim().max(30),
    destIntro: text(240),
    processTitleBefore: z.string().trim().max(60),
    processTitleHighlight: z.string().trim().max(40),
    processTitleAfter: z.string().trim().max(40),
    processIntro: text(240),
    trustPoints: z.array(z.string().trim().min(1).max(50)).max(6),
    aboutTitle: text(100),
    aboutPoints: z.array(z.object({ title: text(60), body: text(200) })).max(6),
    testprepTitle: text(100),
    testprepIntro: text(400),
    diagnosticTitle: text(100),
    diagnosticText: text(300),
    diagnosticCta: text(40),
    journalKicker: text(80),
    journalTitle: text(80),
    journalIntro: text(240),
    storiesKicker: text(40),
    storiesTitle: text(80),
    consultTitle: text(80),
    consultIntro: text(240),
    visitTitle: text(80),
    visitText: text(160),
    seoTitle: text(70),
    seoDescription: text(160),
  }),
  sections: [
    {
      title: "Hero",
      fields: [
        { type: "text", name: "heroEyebrow", label: "Label above headline", wide: true, help: "Small gold caps line. Leave empty to hide." },
        {
          type: "textarea",
          name: "heroTitle",
          label: "Headline",
          rows: 2,
          wide: true,
          help: "Wrap words in *asterisks* to set them in gold italic with an underline, e.g. handled in *detail.*",
        },
        { type: "textarea", name: "heroSubtitle", label: "Subheading", rows: 2, wide: true },
        { type: "text", name: "heroPrimaryCta", label: "Main button" },
        { type: "text", name: "heroSecondaryCta", label: "Second button" },
        { type: "text", name: "heroNote", label: "Note under the buttons", wide: true },
        { type: "text", name: "mapCardTitle", label: "Map card title" },
        { type: "text", name: "mapCardText", label: "Map card text" },
      ],
    },
    {
      title: "Numbers bar",
      fields: [
        {
          type: "repeater",
          name: "stats",
          label: "Stats",
          itemLabel: "Stat",
          max: 4,
          wide: true,
          fields: [
            { name: "value", label: "Number", type: "text" },
            { name: "line1", label: "Label line 1", type: "text" },
            { name: "line2", label: "Label line 2", type: "text" },
          ],
        },
      ],
    },
    {
      title: "Destinations",
      fields: [
        { type: "text", name: "destTitle", label: "Heading" },
        { type: "text", name: "destTitleAccent", label: "Heading accent (italic)" },
        { type: "textarea", name: "destIntro", label: "Intro", rows: 2, wide: true },
      ],
    },
    {
      title: "Process",
      description: "The steps themselves are edited under Services.",
      fields: [
        { type: "text", name: "processTitleBefore", label: "Heading start" },
        { type: "text", name: "processTitleHighlight", label: "Circled words" },
        { type: "text", name: "processTitleAfter", label: "Heading end" },
        { type: "textarea", name: "processIntro", label: "Intro", rows: 2, wide: true },
        { type: "list", name: "trustPoints", label: "Trust points", max: 6, wide: true },
      ],
    },
    {
      title: "Personal attention",
      description: "The quote card shows the featured member from Team.",
      fields: [
        { type: "text", name: "aboutTitle", label: "Heading", wide: true },
        {
          type: "repeater",
          name: "aboutPoints",
          label: "Points",
          itemLabel: "Point",
          max: 6,
          wide: true,
          fields: [
            { name: "title", label: "Title", type: "text", wide: true },
            { name: "body", label: "Text", type: "textarea" },
          ],
        },
      ],
    },
    {
      title: "Test prep",
      description: "Courses are edited under Test prep.",
      fields: [
        { type: "text", name: "testprepTitle", label: "Heading", wide: true },
        { type: "textarea", name: "testprepIntro", label: "Intro", rows: 3, wide: true },
        { type: "text", name: "diagnosticTitle", label: "Diagnostic box title", wide: true },
        { type: "textarea", name: "diagnosticText", label: "Diagnostic box text", rows: 2, wide: true },
        { type: "text", name: "diagnosticCta", label: "Diagnostic button" },
      ],
    },
    {
      title: "Journal & stories",
      fields: [
        { type: "text", name: "journalKicker", label: "Journal kicker", wide: true },
        { type: "text", name: "journalTitle", label: "Journal heading" },
        { type: "textarea", name: "journalIntro", label: "Journal intro", rows: 2, wide: true },
        { type: "text", name: "storiesKicker", label: "Stories kicker" },
        { type: "text", name: "storiesTitle", label: "Stories heading" },
      ],
    },
    {
      title: "Consultation",
      description: "Address and hours come from Business details.",
      fields: [
        { type: "text", name: "consultTitle", label: "Heading" },
        { type: "textarea", name: "consultIntro", label: "Intro", rows: 2, wide: true },
        { type: "text", name: "visitTitle", label: "Visit card heading" },
        { type: "text", name: "visitText", label: "Visit card text" },
      ],
    },
    {
      title: "Search engines",
      fields: [
        { type: "text", name: "seoTitle", label: "Page title", wide: true, help: "Up to 70 characters." },
        { type: "textarea", name: "seoDescription", label: "Description", rows: 2, wide: true, help: "Up to 160 characters." },
      ],
    },
  ],
})

export const business = defineSingleton({
  key: "business",
  title: "Business details",
  description: "Contact details used in the footer, WhatsApp buttons and the visit card.",
  permission: "settings.manage",
  cacheTags: ["business"],
  schema: z.object({
    name: text(80),
    tagline: text(240),
    whatsappNumber: z
      .string()
      .trim()
      .transform((v) => v.replace(/[^\d]/g, ""))
      .pipe(z.string().regex(/^\d{8,15}$/, "Digits only, with country code, e.g. 9779812345678")),
    phone: z.string().trim().max(40).default(""),
    email: z.union([z.literal(""), z.email()]).default(""),
    address: text(200),
    hours: text(120),
    mapUrl: url(),
    facebook: url(),
    instagram: url(),
    youtube: url(),
    tiktok: url(),
    linkedin: url(),
  }),
  sections: [
    {
      title: "Business",
      fields: [
        { type: "text", name: "name", label: "Business name", wide: true },
        { type: "textarea", name: "tagline", label: "Footer tagline", rows: 2, wide: true },
      ],
    },
    {
      title: "Contact",
      fields: [
        { type: "tel", name: "whatsappNumber", label: "WhatsApp number", help: "With country code, e.g. 9779812345678" },
        { type: "tel", name: "phone", label: "Office phone" },
        { type: "email", name: "email", label: "Email" },
        { type: "url", name: "mapUrl", label: "Google Maps link", placeholder: "https://maps.app.goo.gl/…" },
        { type: "textarea", name: "address", label: "Address", rows: 2, wide: true },
        { type: "text", name: "hours", label: "Opening hours", wide: true },
      ],
    },
    {
      title: "Social links",
      description: "Leave empty to hide.",
      fields: [
        { type: "url", name: "facebook", label: "Facebook" },
        { type: "url", name: "instagram", label: "Instagram" },
        { type: "url", name: "youtube", label: "YouTube" },
        { type: "url", name: "tiktok", label: "TikTok" },
        { type: "url", name: "linkedin", label: "LinkedIn" },
      ],
    },
  ],
})

const legal = (key: string, title: string, path: string) =>
  defineSingleton({
    key,
    title,
    description: `The ${title.toLowerCase()} page at ${path}.`,
    permission: "content.manage",
    publicPath: path,
    cacheTags: [`page-${key}`],
    schema: z.object({ title: text(80), body: z.string().trim().max(50_000) }),
    sections: [
      {
        title: "Page",
        fields: [
          { type: "text", name: "title", label: "Title", wide: true },
          { type: "richtext", name: "body", label: "Content", rows: 24, wide: true },
        ],
      },
    ],
  })

export const privacy = legal("privacy", "Privacy policy", "/privacy")
export const terms = legal("terms", "Terms & conditions", "/terms")

/** Editable pages shown under Admin → Pages. Business details has its own menu item. */
export const PAGES = { home, privacy, terms } satisfies Record<string, SingletonDef>
export const SINGLETONS = { ...PAGES, business } satisfies Record<string, SingletonDef>

export function getSingleton(key: string): SingletonDef | null {
  return (SINGLETONS as Record<string, SingletonDef>)[key] ?? null
}
