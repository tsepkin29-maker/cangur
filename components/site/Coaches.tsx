import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCoaches } from "@/lib/content";
import { pick, pickMaybe } from "@/lib/i18n";

/**
 * Renders nothing until the owner adds coaches in /admin. The nav entry
 * hides too (Header receives showCoaches).
 */
export async function Coaches() {
  const [locale, t, coaches] = await Promise.all([
    getLocale(),
    getTranslations("coaches"),
    getCoaches(),
  ]);

  if (coaches.length === 0) return null;

  return (
    <Section id="coaches">
      <SectionHeading kicker={t("kicker")} title={t("title")} />
      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => {
          const bio = pickMaybe(coach.bio, locale);
          const achievements = pickMaybe(coach.achievements, locale);
          return (
            <li
              key={coach.id}
              className="hover-lift overflow-hidden rounded-card border border-line bg-panel"
            >
              {coach.photo ? (
                <Image
                  src={coach.photo}
                  alt={coach.name}
                  width={800}
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  className="aspect-square w-full object-cover"
                />
              ) : null}
              <div className="p-5">
                <h3 className="text-lg font-black">{coach.name}</h3>
                <p className="mt-1 text-[13px] font-extrabold uppercase tracking-wide text-red-soft">
                  {pick(coach.role, locale)}
                  {coach.experience ? ` · ${coach.experience}` : ""}
                </p>
                {bio ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{bio}</p>
                ) : null}
                {achievements ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-faint">
                    {achievements}
                  </p>
                ) : null}
                <div className="mt-3 flex gap-4 text-[13px] font-black text-red-soft">
                  {coach.instagramUrl ? (
                    <a
                      href={coach.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      Instagram
                    </a>
                  ) : null}
                  {coach.ctaUrl ? (
                    <a href={coach.ctaUrl} className="hover:text-white">
                      {t("contact")}
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
