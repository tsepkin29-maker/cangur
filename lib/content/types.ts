/**
 * Domain content types consumed by the public site.
 *
 * They map 1:1 onto the CMS tables (supabase/migrations/0001_init.sql) via
 * lib/content/map.ts. Until Supabase is configured the same shapes are
 * served from lib/content/seed.ts.
 */

import type { Locale } from "@/i18n/routing";

/** Localised text. May be partial — `pick()` falls back gracefully. */
export type Localized = Partial<Record<Locale, string>>;

export interface SiteSettings {
  clubName: string;
  phone: string; // as the owner typed it, e.g. "+373 68 702 717"
  phoneDisplay: string; // alias of `phone`
  phoneHref: string; // digits only, for tel: links
  phoneSecondary: string | null;
  phoneSecondaryHref: string | null;
  email: string | null;
  instagramUrl: string | null;
  instagramHandle: string | null;
  telegramUrl: string | null;
  facebookUrl: string | null;
  addressLine: Localized;
  mapUrl: string | null;
  workHours: Localized;
  hoursOpen: string;
  hoursClose: string;
  locationImageUrl: string | null;
  currency: string;
  priceRange: string;
  ctaCallLabel: Localized;
  routeCtaLabel: Localized;
  bookCtaLabel: Localized;
  defaultCtaLabel: Localized;
  defaultCtaUrl: string | null;
  announcement: { text: Localized; url: string | null; active: boolean };
  logoUrl: string | null;
  ogImageUrl: string | null;
  seo: {
    title: Localized;
    description: Localized;
    ogTitle: Localized;
    ogDescription: Localized;
  };
}

export interface Hero {
  kicker: Localized;
  headline: Localized;
  subtitle: Localized;
  ctaLabel: Localized;
  ctaUrl: string;
  ctaEnabled: boolean;
  videoEnabled: boolean;
  posterUrl: string;
  videoDesktopUrl: string | null;
  videoMobileUrl: string | null;
}

export type NavKey =
  | "programs"
  | "gallery"
  | "prices"
  | "shop"
  | "schedule"
  | "coaches"
  | "contacts";

export interface NavItem {
  key: NavKey;
  label: Localized; // empty -> use i18n default
  visible: boolean;
  sortOrder: number;
}

export interface Program {
  id: string;
  slug: string;
  title: Localized;
  text: Localized;
  image: string;
  badge: Localized | null;
  ctaLabel: Localized | null;
  ctaUrl: string | null;
  active: boolean;
  sortOrder: number;
}

export type PricePeriod = "month" | "session" | "package" | "custom";

export interface PricingPlan {
  id: string;
  slug: string;
  title: Localized;
  description: Localized | null;
  price: number;
  oldPrice: number | null;
  currency: string;
  period: PricePeriod;
  periodLabel: Localized | null;
  sessionsCount: number | null;
  badge: Localized | null;
  featured: boolean;
  ctaLabel: Localized | null;
  ctaUrl: string | null;
  active: boolean;
  sortOrder: number;
}

export type ScheduleAudience = "all" | "men" | "women" | "kids";

export interface ScheduleSlot {
  id: string;
  dayOfWeek: number; // 0 = Monday … 6 = Sunday
  time: string;
  byArrangement: boolean;
  title: Localized;
  coachId: string | null;
  coachName: string | null;
  level: Localized | null;
  audience: ScheduleAudience;
  ageLabel: Localized | null;
  hall: string | null;
  note: Localized | null;
  active: boolean;
  sortOrder: number;
}

export interface Coach {
  id: string;
  name: string;
  photo: string | null;
  role: Localized;
  bio: Localized | null;
  experience: string | null;
  achievements: Localized | null;
  instagramUrl: string | null;
  ctaUrl: string | null;
  active: boolean;
  sortOrder: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: Localized;
  caption: Localized | null;
  active: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  title: Localized;
  spec: Localized;
  description: Localized | null;
  price: number;
  oldPrice: number | null;
  currency: string;
  image: string;
  ctaLabel: Localized | null;
  ctaUrl: string | null;
  active: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  text: Localized;
  author: string;
  avatar: string | null;
  active: boolean;
  sortOrder: number;
}

export type AdPlacement =
  | "after_hero"
  | "after_programs"
  | "after_gallery"
  | "after_pricing"
  | "after_schedule"
  | "before_contacts"
  | "footer";

export type AdLabelType = "advertisement" | "partner";

export interface Advertisement {
  id: string;
  campaignName: string;
  sponsorName: string | null;
  logo: string | null;
  desktopImage: string;
  mobileImage: string | null;
  title: Localized;
  subtitle: Localized | null;
  ctaLabel: Localized | null;
  targetUrl: string;
  placement: AdPlacement;
  labelType: AdLabelType;
  startDate: string | null;
  endDate: string | null;
  priority: number;
  active: boolean;
}
