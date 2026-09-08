import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content/types";
import { pick } from "@/lib/i18n";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cangur.md"
).replace(/\/$/, "");

/** Hard fallbacks so an empty CMS field can never ship an empty
 *  <title>, description or club name. */
const DEFAULT_TITLE: Record<Locale, string> = {
  ru: "Cangur — боксёрский клуб в Кишинёве | Тренировки по боксу",
  ro: "Cangur — club de box în Chișinău | Antrenamente de box",
  en: "Cangur Boxing Club Chișinău | Boxing Training & Gym",
};
const DEFAULT_DESC: Record<Locale, string> = {
  ru: "Боксёрский клуб Cangur в Кишинёве, район Ботаника. Групповые и персональные тренировки по боксу для взрослых, девушек и детей. Абонемент от 1000 MDL.",
  ro: "Club de box Cangur în Chișinău, sectorul Botanica. Antrenamente de grup și individuale de box pentru adulți, femei și copii. Abonament de la 1000 MDL.",
  en: "Cangur boxing club in Chișinău, Botanica district. Group and personal boxing training for adults, women and kids. Membership from 1000 MDL.",
};
const CLUB_NAME_FALLBACK = "Cangur Boxing Club & Gym";

export interface ResolvedSeo {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  clubName: string;
}

/** Single source of truth for page metadata + JSON-LD text. */
export function resolveSeo(settings: SiteSettings, locale: Locale): ResolvedSeo {
  const clubName = settings.clubName?.trim() || CLUB_NAME_FALLBACK;
  const title = pick(settings.seo.title, locale) || DEFAULT_TITLE[locale];
  const description =
    pick(settings.seo.description, locale) || DEFAULT_DESC[locale];
  const ogTitle = pick(settings.seo.ogTitle, locale) || title;
  const ogDescription =
    pick(settings.seo.ogDescription, locale) || description;
  const rawOg = settings.ogImageUrl?.trim() || "/brand/og-image.jpg";
  const ogImage = rawOg.startsWith("http") ? rawOg : `${SITE_URL}${rawOg}`;
  return { title, description, ogTitle, ogDescription, ogImage, clubName };
}

const OG_LOCALE: Record<Locale, string> = {
  ru: "ru_RU",
  ro: "ro_RO",
  en: "en_US",
};
export function ogLocale(l: Locale) {
  return OG_LOCALE[l];
}

/**
 * schema.org SportsActivityLocation (a LocalBusiness subtype — one
 * entity, no competing Organization/LocalBusiness blocks). Built from
 * live CMS settings so NAP + hours stay in sync.
 */
export function buildLocalBusinessJsonLd(
  settings: SiteSettings,
  locale: Locale,
  description: string,
) {
  const clubName = settings.clubName?.trim() || CLUB_NAME_FALLBACK;
  const logo = settings.logoUrl?.trim()
    ? settings.logoUrl.startsWith("http")
      ? settings.logoUrl
      : `${SITE_URL}${settings.logoUrl}`
    : `${SITE_URL}/brand/logo.webp`;

  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": `${SITE_URL}/#business`,
    name: clubName,
    description,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/brand/og-image.jpg`,
    logo,
    telephone: settings.phone,
    priceRange: settings.priceRange,
    currenciesAccepted: settings.currency || "MDL",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Grădina Botanică 2",
      addressLocality: "Chișinău",
      addressCountry: "MD",
    },
    areaServed: { "@type": "City", name: "Chișinău" },
    hasMap: settings.mapUrl ?? undefined,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: settings.hoursOpen,
      closes: settings.hoursClose,
    },
    sameAs: [
      settings.instagramUrl,
      settings.telegramUrl,
      settings.facebookUrl,
    ].filter((v): v is string => Boolean(v)),
  };
}
