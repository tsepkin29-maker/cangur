import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/lib/content/types";
import { HeroVideo } from "./HeroVideo";
import { HeroCta } from "./HeroCta";

export function Hero({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-line bg-[#0a0a0a]"
    >
      <HeroVideo
        poster="/video/hero-poster.jpg"
        webm="/video/hero.webm"
        mp4="/video/hero.mp4"
      />
      <Container className="flex min-h-[330px] flex-col items-start justify-center py-14 sm:min-h-[390px] lg:min-h-[410px]">
        <p className="text-[11px] font-black uppercase tracking-[0.17em] text-red-soft">
          {t("kicker")}
        </p>
        <p className="headline-pulse mt-2.5 font-display text-[clamp(3.4rem,10vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.065em]">
          {t("title")}
        </p>
        <p className="mt-3.5 text-[clamp(1.25rem,3vw,2.1rem)] font-black uppercase tracking-[0.08em] text-[#b9b9be]">
          {t("subtitle")}
        </p>
        <HeroCta
          phone={settings.phone}
          label={t("cta")}
          className="mt-6"
        />
      </Container>
    </section>
  );
}
