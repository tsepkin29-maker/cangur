import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cangur.md"
).replace(/\/$/, "");

/**
 * schema.org SportsActivityLocation JSON-LD, built from live settings
 * so the club's phone / address / hours stay in sync with the CMS.
 */
export function buildLocalBusinessJsonLd(
  settings: SiteSettings,
  locale: Locale,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Cangur Boxing Club & Gym",
    description,
    image: `${SITE_URL}/brand/og-image.jpg`,
    url: `${SITE_URL}/${locale}`,
    telephone: settings.phone,
    priceRange: settings.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Grădina Botanică 2",
      addressLocality: "Chișinău",
      addressRegion: "Botanica",
      addressCountry: "MD",
    },
    hasMap: settings.mapUrl,
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
    sameAs: [settings.instagramUrl, settings.telegramUrl].filter(
      (v): v is string => Boolean(v),
    ),
  };
}
