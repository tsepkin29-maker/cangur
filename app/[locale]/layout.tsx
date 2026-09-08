import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Onest } from "next/font/google";

import { routing } from "@/i18n/routing";
import { SITE_URL, resolveSeo, ogLocale } from "@/lib/seo";
import { pick } from "@/lib/i18n";
import { getCoaches, getSettings } from "@/lib/content";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { AdminAffordances } from "@/components/site/AdminAffordances";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileCallBar } from "@/components/site/MobileCallBar";
import { ScrollProgress } from "@/components/site/ScrollProgress";

import "../globals.css";

// Display type — used for the LCP headline, so this one is preloaded.
const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-onest",
  display: "swap",
});

// Body / UI — below the fold on first paint, so skip the preload to keep
// bandwidth for the hero on slow connections.
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const settings = await getSettings();
  const seo = resolveSeo(settings, locale);

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}`]),
  );
  const altLocales = routing.locales
    .filter((l) => l !== locale)
    .map(ogLocale);

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    applicationName: seo.clubName,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}` },
    },
    openGraph: {
      type: "website",
      siteName: seo.clubName,
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `/${locale}`,
      locale: ogLocale(locale),
      alternateLocale: altLocales,
      images: [
        { url: seo.ogImage, width: 1200, height: 630, alt: seo.clubName },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [seo.ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tNav, settings, coaches] = await Promise.all([
    getTranslations({ locale, namespace: "a11y" }),
    getTranslations({ locale, namespace: "nav" }),
    getSettings(),
    getCoaches(),
  ]);
  const callLabel = pick(settings.ctaCallLabel, locale) || tNav("call");

  return (
    <html lang={locale} className={`${onest.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-red focus:px-4 focus:py-2 focus:font-bold focus:text-white"
          >
            {t("skipToContent")}
          </a>
          <ScrollProgress label={t("scrollProgress")} />
          <AnnouncementBar />
          <Header showCoaches={coaches.length > 0} />
          <main id="main">{children}</main>
          <Footer settings={settings} />
          <MobileCallBar
            phone={settings.phoneHref}
            phoneDisplay={settings.phoneDisplay}
            label={callLabel}
          />
          <AdminAffordances />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
