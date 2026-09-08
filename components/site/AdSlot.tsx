import Image from "next/image";
import { getLocale } from "next-intl/server";
import { getAds } from "@/lib/content";
import type { AdPlacement } from "@/lib/content/types";
import { AdImpression } from "./AdImpression";

/**
 * Partner / sponsor slot.
 *
 * Renders nothing when there is no active campaign for the placement,
 * so an empty slot never leaves a gap in the layout. When a campaign
 * exists it is styled as part of the Cangur interface — not an ad unit.
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

  await getLocale(); // keeps the slot locale-aware for future copy

  return (
    <aside
      className={className}
      aria-label={ad.sponsorName ? `Partner: ${ad.sponsorName}` : "Partner"}
    >
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        data-ad-id={ad.id}
        className="group relative block overflow-hidden rounded-card border border-line bg-panel"
      >
        <picture>
          {ad.mobileImage ? (
            <source media="(max-width: 640px)" srcSet={ad.mobileImage} />
          ) : null}
          <Image
            src={ad.image}
            alt={ad.title}
            width={1180}
            height={240}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1180px) 100vw, 1180px"
          />
        </picture>
        {(ad.title || ad.sponsorName) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent p-4">
            <span className="text-sm font-black">{ad.title}</span>
            {ad.sponsorName ? (
              <span className="text-[11px] uppercase tracking-widest text-faint">
                {ad.sponsorName}
              </span>
            ) : null}
          </div>
        )}
      </a>
      <AdImpression adId={ad.id} placement={placement} />
    </aside>
  );
}
