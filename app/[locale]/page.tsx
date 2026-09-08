import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/content";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";

import { Hero } from "@/components/site/Hero";
import { Programs } from "@/components/site/Programs";
import { Gallery } from "@/components/site/Gallery";
import { Pricing } from "@/components/site/Pricing";
import { Schedule } from "@/components/site/Schedule";
import { Testimonials } from "@/components/site/Testimonials";
import { Coaches } from "@/components/site/Coaches";
import { ProShop } from "@/components/site/ProShop";
import { Contacts } from "@/components/site/Contacts";
import { AdSlot } from "@/components/site/AdSlot";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [settings, tMeta] = await Promise.all([
    getSettings(),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  const jsonLd = buildLocalBusinessJsonLd(
    settings,
    locale,
    tMeta("description"),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero settings={settings} />

      <Container className="pt-8">
        <AdSlot placement="home_top" />
      </Container>

      <Programs />
      <Gallery />
      <Pricing />
      <Schedule />

      <Container>
        <AdSlot placement="home_middle" />
      </Container>

      <Testimonials />
      <Coaches />
      <ProShop />
      <Contacts />
    </>
  );
}
