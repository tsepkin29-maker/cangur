import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGalleryImages } from "@/lib/content";
import { pick } from "@/lib/i18n";
import { GalleryScroller } from "./GalleryScroller";

export async function Gallery() {
  const [locale, t, images] = await Promise.all([
    getLocale(),
    getTranslations("gallery"),
    getGalleryImages(),
  ]);

  if (images.length === 0) return null;

  return (
    <Section id="gallery">
      <SectionHeading kicker={t("kicker")} title={t("title")} />
      <GalleryScroller
        prevLabel={t("prev")}
        nextLabel={t("next")}
        images={images.map((img) => ({
          id: img.id,
          src: img.src,
          width: img.width,
          height: img.height,
          alt: pick(img.alt, locale),
        }))}
      />
    </Section>
  );
}
