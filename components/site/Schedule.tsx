import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getScheduleSlots } from "@/lib/content";
import { pick, pickMaybe } from "@/lib/i18n";
import { SectionView } from "./SectionView";

export async function Schedule() {
  const [locale, t, slots] = await Promise.all([
    getLocale(),
    getTranslations("schedule"),
    getScheduleSlots(),
  ]);

  if (slots.length === 0) return null;

  const weekdays = t.raw("weekdays") as string[];
  const days = weekdays
    .map((name, i) => ({ name, slots: slots.filter((s) => s.dayOfWeek === i) }))
    .filter((d) => d.slots.length > 0);

  return (
    <Section id="schedule">
      <SectionView event="schedule_view" />
      <SectionHeading kicker={t("kicker")} title={t("title")} />

      <div className="mb-5 flex flex-col gap-1 rounded-2xl border border-red/30 bg-red/[0.055] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[13px] font-extrabold text-muted">
          {t("workHours")}
        </span>
        <strong className="whitespace-nowrap text-lg font-black">
          {t("hours")}
        </strong>
      </div>

      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {days.map((day) => (
          <li
            key={day.name}
            className="hover-lift rounded-card border border-line bg-panel p-3.5"
          >
            <h3 className="mb-2.5 text-sm font-black">{day.name}</h3>
            <ul className="divide-y divide-line">
              {day.slots.map((slot) => {
                const level = pickMaybe(slot.level, locale);
                const age = pickMaybe(slot.ageLabel, locale);
                const note = pickMaybe(slot.note, locale);
                const meta = [
                  slot.coachName,
                  level,
                  age,
                  slot.hall,
                ].filter(Boolean);
                return (
                  <li key={slot.id} className="py-2 first:pt-0 last:pb-0">
                    <span className="block text-[13px] font-black">
                      {slot.byArrangement ? t("byArrangement") : slot.time}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-faint">
                      {pick(slot.title, locale)}
                    </span>
                    {meta.length > 0 ? (
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                        {meta.join(" · ")}
                      </span>
                    ) : null}
                    {note ? (
                      <span className="mt-0.5 block text-[11px] italic leading-snug text-faint">
                        {note}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>

      <p className="mt-4 max-w-[60ch] text-sm text-muted">{t("note")}</p>
    </Section>
  );
}
