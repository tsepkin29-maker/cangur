import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { getPrograms } from "@/lib/content";
import { pick } from "@/lib/i18n";

export async function Programs() {
  const [locale, t, programs] = await Promise.all([
    getLocale(),
    getTranslations("programs"),
    getPrograms(),
  ]);

  return (
    <Section id="programs">
      <div className="mb-6">
        <p className="text-[11px] font-black uppercase tracking-[0.17em] text-red-soft">
          {t("kicker")}
        </p>
        <h1 className="mt-2.5 max-w-[16ch] font-display text-[clamp(2.6rem,7vw,5.4rem)] font-black uppercase leading-[0.85] tracking-[-0.05em]">
          {t("title")}
          <span className="sr-only">{t("srSuffix")}</span>
        </h1>
      </div>

      <ul className="snap-x -mx-[var(--site-gutter)] px-[var(--site-gutter)] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3.5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {programs.map((p) => (
          <li
            key={p.id}
            className="edge-glow hover-lift relative aspect-[3/4] w-[82%] max-w-[420px] shrink-0 overflow-hidden rounded-card border border-line bg-panel sm:aspect-auto sm:h-[440px] sm:w-auto sm:max-w-none lg:h-[500px]"
          >
            <Image
              src={p.image}
              alt={pick(p.title, locale)}
              fill
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95" />
            <div className="absolute inset-x-5 bottom-5 z-[2]">
              <h3 className="font-display text-[1.55rem] font-black tracking-[-0.035em]">
                {pick(p.title, locale)}
              </h3>
              <p className="mt-1.5 max-w-[28ch] text-[13px] leading-snug text-[#bbb]">
                {pick(p.text, locale)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
