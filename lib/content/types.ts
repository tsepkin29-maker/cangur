/**
 * Row-shaped content types.
 *
 * These deliberately mirror the future Postgres/Supabase schema
 * (see supabase/migrations/0001_init.sql). Until STEP 7–8, the data
 * is served from lib/content/seed.ts; after that the getters in
 * lib/content/index.ts will query Supabase and return the same shapes,
 * so no component needs to change.
 */

import type { Locale } from "@/i18n/routing";

/** Localized string: one value per supported locale. */
export type Localized = Record<Locale, string>;

export interface SiteSettings {
  phone: string;
  phoneDisplay: string;
  instagramUrl: string;
  instagramHandle: string;
  telegramUrl: string | null;
  addressLine: Localized;
  mapUrl: string;
  workHours: Localized;
  hoursOpen: string; // "07:00"
  hoursClose: string; // "21:00"
  priceRange: string; // schema.org priceRange
  announcement: { text: Localized; active: boolean } | null;
}

export type ProgramType = "men" | "women" | "kids" | "personal";

export interface Program {
  id: string;
  type: ProgramType;
  title: Localized;
  text: Localized;
  image: string;
  imageWidth: number;
  imageHeight: number;
  active: boolean;
  sortOrder: number;
}

export type PricePeriod = "month" | "session" | "package";

export interface PricingPlan {
  id: string;
  slug: string;
  title: Localized;
  description: Localized | null;
  price: number;
  oldPrice: number | null;
  currency: string; // "MDL"
  period: PricePeriod;
  sessionsCount: number | null;
  badge: Localized | null;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

export type ScheduleAudience = "all" | "men" | "women" | "kids";

export interface ScheduleSlot {
  id: string;
  dayOfWeek: number; // 0 = Monday … 6 = Sunday
  time: string; // "19:00" | "09:00 / 12:00" | "" when by arrangement
  byArrangement: boolean;
  title: Localized;
  coachId: string | null;
  audience: ScheduleAudience;
  active: boolean;
  sortOrder: number;
}

export interface Coach {
  id: string;
  name: string;
  photo: string | null;
  role: Localized;
  bio: Localized | null;
  instagramUrl: string | null;
  active: boolean;
  sortOrder: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: Localized;
  active: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  spec: Localized;
  price: number;
  currency: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  active: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  text: Localized;
  author: string;
  active: boolean;
  sortOrder: number;
}

export type AdPlacement =
  | "home_top"
  | "home_middle"
  | "pricing"
  | "schedule"
  | "footer";

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  targetUrl: string;
  sponsorName: string | null;
  placement: AdPlacement;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
}
