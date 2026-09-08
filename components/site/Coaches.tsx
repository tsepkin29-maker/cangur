import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCoaches } from "@/lib/content";
import { pick, pickMaybe } from "@/lib/i18n";

/**
 * Coaches section. The legacy site had no coach data, so this renders
 * nothing until the owner adds coaches in /admin (STEP 10). The markup,
 * data shape and nav entry are already wired so it appears automatically.
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
        {coaches.map((coach) => (
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
              </p>
              {pickMaybe(coach.bio, locale) ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {pickMaybe(coach.bio, locale)}
                </p>
              ) : null}
              {coach.instagramUrl ? (
                <a
                  href={coach.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[13px] font-black text-red-soft hover:text-white"
                >
                  Instagram
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
