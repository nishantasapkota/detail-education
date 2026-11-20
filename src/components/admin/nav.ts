import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarDays,
  FileText,
  GraduationCap,
  Handshake,
  History,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  Map,
  MessageSquareQuote,
  Newspaper,
  PanelsTopLeft,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react"

import { can, type Permission, type Role } from "@/lib/auth/roles"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  permission: Permission
}
export type NavGroup = { label: string; items: NavItem[] }

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
    ],
  },
  {
    label: "Students",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Inbox, permission: "leads.manage" },
      {
        href: "/admin/applications",
        label: "Applications",
        icon: FileText,
        permission: "applications.manage",
      },
      {
        href: "/admin/appointments",
        label: "Appointments",
        icon: CalendarCheck,
        permission: "appointments.manage",
      },
      {
        href: "/admin/events",
        label: "Events",
        icon: CalendarDays,
        permission: "events.manage",
      },
    ],
  },
  {
    label: "Website",
    items: [
      {
        href: "/admin/pages",
        label: "Pages",
        icon: PanelsTopLeft,
        permission: "content.manage",
      },
      {
        href: "/admin/destinations",
        label: "Destinations",
        icon: Map,
        permission: "content.manage",
      },
      {
        href: "/admin/articles",
        label: "Journal",
        icon: Newspaper,
        permission: "content.manage",
      },
      {
        href: "/admin/courses",
        label: "Test prep",
        icon: GraduationCap,
        permission: "content.manage",
      },
      {
        href: "/admin/services",
        label: "Services",
        icon: BriefcaseBusiness,
        permission: "content.manage",
      },
      {
        href: "/admin/documentation",
        label: "Visa roadmaps",
        icon: Map,
        permission: "content.manage",
      },
      {
        href: "/admin/testimonials",
        label: "Testimonials",
        icon: MessageSquareQuote,
        permission: "testimonials.manage",
      },
      { href: "/admin/team", label: "Team", icon: Users, permission: "content.manage" },
      {
        href: "/admin/partners",
        label: "Partners",
        icon: Handshake,
        permission: "content.manage",
      },
      {
        href: "/admin/visas",
        label: "Visa success",
        icon: BadgeCheck,
        permission: "content.manage",
      },
      {
        href: "/admin/media",
        label: "Media library",
        icon: ImageIcon,
        permission: "media.manage",
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        href: "/admin/business",
        label: "Business details",
        icon: Building2,
        permission: "settings.manage",
      },
      { href: "/admin/staff", label: "Staff", icon: UserCog, permission: "users.manage" },
      {
        href: "/admin/activity",
        label: "Activity log",
        icon: History,
        permission: "activity.view",
      },
    ],
  },
]

/** Nav filtered to what this role may open. Empty groups are dropped. */
export function navForRole(role: Role): NavGroup[] {
  return ADMIN_NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => can(role, i.permission)),
  })).filter((g) => g.items.length > 0)
}
