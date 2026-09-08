import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Onest } from "next/font/google";

import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { pick } from "@/lib/i18n";
import { getCoaches, getSettings } from "@/lib/content";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileCallBar } from "@/components/site/MobileCallBar";
import { ScrollProgress } from "@/components/site/ScrollProgress";

import "../globals.css";

const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-onest",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
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
  const title =
    pick(settings.seo.title, locale) || `${settings.clubName} — Chișinău`;
  const description = pick(settings.seo.description, locale) || settings.clubName;
  const ogTitle = pick(settings.seo.ogTitle, locale) || title;
  const ogDescription =
    pick(settings.seo.ogDescription, locale) || description;
  const ogImage = settings.ogImageUrl || "/brand/og-image.jpg";

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}`]),
  );

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}` },
    },
    openGraph: {
      type: "website",
      siteName: settings.clubName,
      title: ogTitle,
      description: ogDescription,
      url: `/${locale}`,
      locale: locale === "ru" ? "ru_RU" : locale === "ro" ? "ro_RO" : "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.clubName }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
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
            phone={settings.phone}
            phoneDisplay={settings.phoneDisplay}
            label={callLabel}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
