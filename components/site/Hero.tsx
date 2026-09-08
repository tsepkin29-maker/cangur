import { getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getHero } from "@/lib/content";
import { pick } from "@/lib/i18n";
import { HeroVideo } from "./HeroVideo";
import { HeroCta } from "./HeroCta";

export async function Hero() {
  const [locale, hero] = await Promise.all([getLocale(), getHero()]);

  const headline = pick(hero.headline, locale);
  const subtitle = pick(hero.subtitle, locale);
  const kicker = pick(hero.kicker, locale);
  const ctaLabel = pick(hero.ctaLabel, locale);
  const showVideo = hero.videoEnabled && Boolean(hero.videoDesktopUrl);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-line bg-[#0a0a0a]"
    >
      <HeroVideo
        poster={hero.posterUrl || "/video/hero-poster.jpg"}
        webm={showVideo ? hero.videoDesktopUrl! : null}
        mp4={showVideo && hero.videoDesktopUrl === "/video/hero.webm" ? "/video/hero.mp4" : null}
        mobile={hero.videoMobileUrl}
      />
      <Container className="flex min-h-[330px] flex-col items-start justify-center py-14 sm:min-h-[390px] lg:min-h-[410px]">
        {kicker ? (
          <p className="text-[11px] font-black uppercase tracking-[0.17em] text-red-soft">
            {kicker}
          </p>
        ) : null}
        {headline ? (
          <p className="headline-pulse mt-2.5 font-display text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.065em] [overflow-wrap:break-word]">
            {headline}
          </p>
        ) : null}
        {subtitle ? (
          <p className="mt-3.5 text-[clamp(1.25rem,3vw,2.1rem)] font-black uppercase tracking-[0.08em] text-[#b9b9be]">
            {subtitle}
          </p>
        ) : null}
        {hero.ctaEnabled && ctaLabel && hero.ctaUrl ? (
          <HeroCta href={hero.ctaUrl} label={ctaLabel} className="mt-6" />
        ) : null}
      </Container>
    </section>
  );
}
