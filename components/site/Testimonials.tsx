import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTestimonials } from "@/lib/content";
import { pick } from "@/lib/i18n";

export async function Testimonials() {
  const [locale, t, items] = await Promise.all([
    getLocale(),
    getTranslations("testimonials"),
    getTestimonials(),
  ]);

  if (items.length === 0) return null;

  return (
    <Section>
      <SectionHeading kicker={t("kicker")} title={t("title")} />
      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="hover-lift rounded-card border border-line bg-panel p-5"
          >
            <p className="leading-relaxed text-[#ccc]">
              {pick(item.text, locale)}
            </p>
            <p className="mt-3.5 font-black">— {item.author}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
