import { getLocale, getTranslations } from "next-intl/server";
import { getAds } from "@/lib/content";
import { pick, pickMaybe } from "@/lib/i18n";
import type { AdPlacement } from "@/lib/content/types";
import { AdBlock } from "./AdBlock";

/**
 * Partner / sponsor slot.
 *
 * Renders nothing when there is no live campaign for the placement, so an
 * empty slot never leaves a gap. Otherwise it renders one premium AdBlock
 * styled as part of the Cangur interface — distinguishable from own
 * content only by a small PARTNER / ADVERTISEMENT label.
 */
export async function AdSlot({
  placement,
  className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const ads = await getAds(placement);
  const ad = ads[0];
  if (!ad) return null;

  const [locale, t] = await Promise.all([getLocale(), getTranslations("ads")]);

  return (
    <AdBlock
      className={className}
      id={ad.id}
      placement={placement}
      label={ad.labelType === "advertisement" ? t("advertisement") : t("partner")}
      sponsorName={ad.sponsorName}
      logo={ad.logo}
      desktopImage={ad.desktopImage}
      mobileImage={ad.mobileImage}
      title={pick(ad.title, locale)}
      subtitle={pickMaybe(ad.subtitle, locale)}
      ctaLabel={pickMaybe(ad.ctaLabel, locale)}
      targetUrl={ad.targetUrl}
    />
  );
}
