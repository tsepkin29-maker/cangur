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

  return (
    <Section id="contacts">
      <SectionHeading kicker={t("kicker")} title={t("title")} />

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <ContactLinks
          labels={{
            phone: t("phoneLabel"),
            instagram: t("instagramLabel"),
            address: t("addressLabel"),
          }}
          phone={settings.phone}
          phoneDisplay={settings.phoneDisplay}
          instagramUrl={settings.instagramUrl}
          instagramHandle={settings.instagramHandle}
          mapUrl={settings.mapUrl}
          address={address}
        />

        {/* Location card — replaces the legacy fake CSS "map".
            Honest: address + hours + a real directions link, no
            imitation street grid, no paid Static Maps dependency. */}
        <div className="relative flex flex-col justify-end overflow-hidden rounded-card border border-line bg-panel p-5">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_70%_30%,rgba(237,27,63,0.35),transparent_45%),repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_46px),repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_46px)]"
          />
          <div className="relative">
            <h3 className="font-display text-lg font-black uppercase">
              Cangur Boxing Club &amp; Gym
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{address}</p>
            <p className="mt-1 text-sm text-muted">
              {t("hoursLabel")}: {pick(settings.workHours, locale)} ·{" "}
              {settings.hoursOpen}–{settings.hoursClose}
            </p>
            <RouteButton
              mapUrl={settings.mapUrl}
              label={t("routeCta")}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
