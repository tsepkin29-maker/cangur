import type { Tables } from "@/lib/supabase/database.types";
import type { Locale } from "@/i18n/routing";
import type {
  Advertisement,
  Coach,
  GalleryImage,
  Hero,
  Localized,
  NavItem,
  PricingPlan,
  Product,
  Program,
  ScheduleSlot,
  SiteSettings,
  Testimonial,
} from "./types";

const L = (v: unknown): Localized => (v && typeof v === "object" ? (v as Localized) : {});
const Ln = (v: unknown): Localized | null => {
  const o = L(v);
  return Object.values(o).some((x) => x && String(x).trim()) ? o : null;
};
const num = (v: number | string | null): number | null =>
  v === null ? null : typeof v === "string" ? Number(v) : v;
const telHref = (v: string | null): string =>
  (v ?? "").replace(/[^+\d]/g, "");

export function mapSettings(row: Tables<"settings">): SiteSettings {
  return {
    clubName: row.club_name,
    phone: row.phone,
    phoneDisplay: row.phone,
    phoneHref: telHref(row.phone),
    phoneSecondary: row.phone_secondary,
    phoneSecondaryHref: row.phone_secondary ? telHref(row.phone_secondary) : null,
    email: row.email,
    instagramUrl: row.instagram_url,
    instagramHandle: row.instagram_url
      ? "@" + row.instagram_url.replace(/\/+$/, "").split("/").pop()
      : null,
    telegramUrl: row.telegram_url,
    facebookUrl: row.facebook_url,
    addressLine: L(row.address),
    mapUrl: row.map_url,
    workHours: L(row.working_hours),
    hoursOpen: row.hours_open,
    hoursClose: row.hours_close,
    locationImageUrl: row.location_image_url,
    currency: row.default_currency,
    priceRange: row.price_range,
    ctaCallLabel: L(row.cta_call_label),
    routeCtaLabel: L(row.route_cta_label),
    bookCtaLabel: L(row.book_cta_label),
    defaultCtaLabel: L(row.default_cta_label),
    defaultCtaUrl: row.default_cta_url,
    announcement: {
      text: L(row.announcement_text),
      url: row.announcement_url,
      active: row.announcement_active,
    },
    logoUrl: row.logo_url,
    ogImageUrl: row.og_image_url,
    seo: {
      title: L(row.seo_title),
      description: L(row.seo_description),
      ogTitle: L(row.og_title),
      ogDescription: L(row.og_description),
    },
  };
}

export function mapHero(row: Tables<"hero">): Hero {
  return {
    kicker: L(row.kicker),
    headline: L(row.headline),
    subtitle: L(row.subtitle),
    ctaLabel: L(row.cta_label),
    ctaUrl: row.cta_url,
    ctaEnabled: row.cta_enabled,
    videoEnabled: row.video_enabled,
    posterUrl: row.poster_url,
    videoDesktopUrl: row.video_desktop_url,
    videoMobileUrl: row.video_mobile_url,
  };
}

export function mapNavItem(row: Tables<"nav_items">): NavItem {
  return {
    key: row.key,
    label: L(row.label),
    visible: row.visible,
    sortOrder: row.sort_order,
  };
}

export function mapProgram(row: Tables<"programs">): Program {
  return {
    id: row.id,
    slug: row.slug,
    title: L(row.title),
    text: L(row.description),
    image: row.image_url,
    badge: Ln(row.badge),
    ctaLabel: Ln(row.cta_label),
    ctaUrl: row.cta_url,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export function mapPricingPlan(row: Tables<"pricing_plans">): PricingPlan {
  return {
    id: row.id,
    slug: row.slug,
    title: L(row.title),
    description: Ln(row.description),
    price: num(row.price) ?? 0,
    oldPrice: num(row.old_price),
    currency: row.currency,
    period: row.period,
    periodLabel: Ln(row.period_label),
    sessionsCount: row.sessions_count,
    badge: Ln(row.badge),
    featured: row.featured,
    ctaLabel: Ln(row.cta_label),
    ctaUrl: row.cta_url,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export function mapScheduleSlot(
  row: Tables<"schedule_slots">,
  coachName: string | null = null,
): ScheduleSlot {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    time: row.time_label,
    byArrangement: row.by_arrangement,
    title: L(row.title),
    coachId: row.coach_id,
    coachName,
    level: Ln(row.level),
    audience: row.audience,
    ageLabel: Ln(row.age_label),
    hall: row.hall,
    note: Ln(row.note),
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export function mapCoach(row: Tables<"coaches">): Coach {
  return {
    id: row.id,
    name: row.name,
    photo: row.photo_url,
    role: L(row.role),
    bio: Ln(row.bio),
    experience: row.experience,
    achievements: Ln(row.achievements),
    instagramUrl: row.instagram_url,
    ctaUrl: row.cta_url,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export function mapGalleryImage(row: Tables<"gallery_images">): GalleryImage {
  return {
    id: row.id,
    src: row.image_url,
    alt: L(row.alt),
    caption: Ln(row.caption),
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export function mapProduct(row: Tables<"products">): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: L(row.title),
    spec: L(row.spec),
    description: Ln(row.description),
    price: num(row.price) ?? 0,
    oldPrice: num(row.old_price),
    currency: row.currency,
    image: row.image_url,
    ctaLabel: Ln(row.cta_label),
    ctaUrl: row.cta_url,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export function mapTestimonial(row: Tables<"testimonials">): Testimonial {
  return {
    id: row.id,
    text: L(row.body),
    author: row.author,
    avatar: row.avatar_url,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export function mapAdvertisement(row: Tables<"advertisements">): Advertisement {
  return {
    id: row.id,
    campaignName: row.campaign_name,
    sponsorName: row.sponsor_name,
    logo: row.logo_url,
    desktopImage: row.desktop_image_url,
    mobileImage: row.mobile_image_url,
    title: L(row.title),
    subtitle: Ln(row.subtitle),
    ctaLabel: Ln(row.cta_label),
    targetUrl: row.target_url,
    placement: row.placement,
    labelType: row.label_type,
    startDate: row.start_date,
    endDate: row.end_date,
    priority: row.priority,
    active: row.active,
  };
}

/** locale-aware pick used by builders that live outside React. */
export function pickLocale(v: Localized, locale: Locale): string {
  return v[locale] ?? v.ru ?? Object.values(v)[0] ?? "";
}
