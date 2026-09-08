import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { getProducts } from "@/lib/content";
import { pick, pickMaybe } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { ProShopCarousel } from "./ProShopCarousel";

export async function ProShop() {
  const [locale, t, products] = await Promise.all([
    getLocale(),
    getTranslations("shop"),
    getProducts(),
  ]);

  if (products.length === 0) return null;

  return (
    <Section
      id="shop"
      className="bg-[radial-gradient(circle_at_15%_20%,rgba(237,27,63,0.08),transparent_20%),linear-gradient(180deg,#0b0b0b,#080808)]"
    >
      <ProShopCarousel
        kicker={t("kicker")}
        title={t("title")}
        viewLabel={t("view")}
        closeLabel={t("close")}
        products={products.map((p) => ({
          id: p.id,
          title: pick(p.title, locale),
          spec: pick(p.spec, locale),
          description: pickMaybe(p.description, locale),
          price: formatPrice(p.price, p.currency),
          oldPrice: p.oldPrice ? formatPrice(p.oldPrice, p.currency) : null,
          image: p.image,
          ctaLabel: pickMaybe(p.ctaLabel, locale),
          ctaUrl: p.ctaUrl,
        }))}
      />
    </Section>
  );
}
