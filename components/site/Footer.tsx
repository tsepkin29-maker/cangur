import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/lib/content/types";
import { pick } from "@/lib/i18n";
import { AdSlot } from "./AdSlot";

export function Footer({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const address = pick(settings.addressLine, locale);

  return (
    <footer className="border-t border-line py-9 text-xs text-faint">
      <Container className="flex flex-col gap-6">
        <AdSlot placement="footer" />

        <div className="grid gap-5 sm:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="font-display text-sm font-black uppercase tracking-wide text-white">
              {settings.clubName}
            </p>
            <p className="mt-1.5 max-w-[52ch] leading-relaxed">{t("about")}</p>
          </div>
          <address className="not-italic leading-relaxed">
            <span className="block">{address}</span>
            <a href={`tel:${settings.phoneHref}`} className="block hover:text-white">
              {settings.phoneDisplay}
            </a>
            <span className="block">
              {pick(settings.workHours, locale)} · {settings.hoursOpen}–
              {settings.hoursClose}
            </span>
            {settings.instagramUrl ? (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white"
              >
                {settings.instagramHandle ?? "Instagram"}
              </a>
            ) : null}
          </address>
        </div>

        <p className="border-t border-line pt-4">
          {t("rights", { year: new Date().getFullYear() })}
        </p>
      </Container>
    </footer>
  );
}
