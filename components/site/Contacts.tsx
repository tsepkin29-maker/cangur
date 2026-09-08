import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSettings } from "@/lib/content";
import { pick } from "@/lib/i18n";
import { ContactLinks, RouteButton } from "./ContactLinks";

export async function Contacts() {
  const [locale, t, settings] = await Promise.all([
    getLocale(),
    getTranslations("contacts"),
    getSettings(),
  ]);

  const address = pick(settings.addressLine, locale);
  const routeLabel = pick(settings.routeCtaLabel, locale) || t("routeCta");

  return (
    <Section id="contacts">
      <SectionHeading kicker={t("kicker")} title={t("title")} />

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <ContactLinks
          labels={{
            phone: t("phoneLabel"),
            instagram: t("instagramLabel"),
            address: t("addressLabel"),
            telegram: "Telegram",
            email: "Email",
          }}
          phone={settings.phone}
          phoneDisplay={settings.phoneDisplay}
          phoneSecondary={settings.phoneSecondary}
          email={settings.email}
          instagramUrl={settings.instagramUrl}
          instagramHandle={settings.instagramHandle}
          telegramUrl={settings.telegramUrl}
          mapUrl={settings.mapUrl}
          address={address}
        />

        {/* Location card — replaces the legacy fake CSS "map". */}
        <div className="relative flex flex-col justify-end overflow-hidden rounded-card border border-line bg-panel p-5">
          {settings.locationImageUrl ? (
            <Image
              src={settings.locationImageUrl}
              alt={address}
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover opacity-60"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_70%_30%,rgba(237,27,63,0.35),transparent_45%),repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_46px),repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_46px)]"
            />
          )}
          <div className="relative">
            <h3 className="font-display text-lg font-black uppercase">
              {settings.clubName}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{address}</p>
            <p className="mt-1 text-sm text-muted">
              {t("hoursLabel")}: {pick(settings.workHours, locale)} ·{" "}
              {settings.hoursOpen}–{settings.hoursClose}
            </p>
            {settings.mapUrl ? (
              <RouteButton
                mapUrl={settings.mapUrl}
                label={routeLabel}
                className="mt-4"
              />
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
