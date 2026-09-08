import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { getPrograms } from "@/lib/content";
import { pick, pickMaybe } from "@/lib/i18n";

export async function Programs() {
  const [locale, t, programs] = await Promise.all([
    getLocale(),
    getTranslations("programs"),
    getPrograms(),
  ]);

  if (programs.length === 0) return null;

  return (
    <Section id="programs">
      <div className="mb-6">
        <p className="text-[11px] font-black uppercase tracking-[0.17em] text-red-soft">
          {t("kicker")}
        </p>
        <h1 className="mt-2.5 max-w-[18ch] font-display text-[clamp(1.9rem,8vw,5.4rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] [overflow-wrap:break-word]">
          {t("title")}
          <span className="sr-only">{t("srSuffix")}</span>
        </h1>
      </div>

      <ul className="snap-x -mx-[var(--site-gutter)] px-[var(--site-gutter)] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3.5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {programs.map((p) => {
          const badge = pickMaybe(p.badge, locale);
          const cta = pickMaybe(p.ctaLabel, locale);
          return (
            <li
              key={p.id}
              className="edge-glow hover-lift relative aspect-[3/4] w-[82%] max-w-[420px] shrink-0 overflow-hidden rounded-card border border-line bg-panel sm:aspect-auto sm:h-[440px] sm:w-auto sm:max-w-none lg:h-[500px]"
            >
              {p.image ? (
                <Image
                  src={p.image}
                  alt={pick(p.title, locale)}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 280px"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95" />
              {badge ? (
                <div className="absolute left-4 top-4 z-[2]">
                  <Badge>{badge}</Badge>
                </div>
              ) : null}
              <div className="absolute inset-x-5 bottom-5 z-[2]">
                <h3 className="font-display text-[1.55rem] font-black tracking-[-0.035em]">
                  {pick(p.title, locale)}
                </h3>
                <p className="mt-1.5 max-w-[28ch] text-[13px] leading-snug text-[#bbb]">
                  {pick(p.text, locale)}
                </p>
                {cta && p.ctaUrl ? (
                  <a
                    href={p.ctaUrl}
                    className="mt-3 inline-block text-[13px] font-black text-red-soft hover:text-white"
                  >
                    {cta}
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
