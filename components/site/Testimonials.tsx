import Image from "next/image";
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
            <div className="mt-3.5 flex items-center gap-2.5">
              {item.avatar ? (
                <Image
                  src={item.avatar}
                  alt={item.author}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : null}
              <span className="font-black">— {item.author}</span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
