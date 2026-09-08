import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/content";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { pick } from "@/lib/i18n";
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

// Static by default; admin saves purge the relevant content tags for an
// instant update, and this is the safety-net refresh interval.
export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const settings = await getSettings();
  const description =
    pick(settings.seo.description, locale) || settings.clubName;
  const jsonLd = buildLocalBusinessJsonLd(settings, locale, description);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <Container className="pt-8">
        <AdSlot placement="after_hero" />
      </Container>

      <Programs />
      <Container>
        <AdSlot placement="after_programs" />
      </Container>

      <Gallery />
      <Container>
        <AdSlot placement="after_gallery" />
      </Container>

      <Pricing />
      <Container>
        <AdSlot placement="after_pricing" />
      </Container>

      <Schedule />
      <Container>
        <AdSlot placement="after_schedule" />
      </Container>

      <Testimonials />
      <Coaches />
      <ProShop />

      <Container>
        <AdSlot placement="before_contacts" />
      </Container>
      <Contacts />
    </>
  );
}
