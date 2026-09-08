import { getLocale } from "next-intl/server";
import { getSettings } from "@/lib/content";
import { pick } from "@/lib/i18n";

/** Thin bar above the header. Renders nothing unless enabled + has text. */
export async function AnnouncementBar() {
  const [locale, settings] = await Promise.all([getLocale(), getSettings()]);
  const a = settings.announcement;
  if (!a.active) return null;
  const text = pick(a.text, locale);
  if (!text) return null;

  const inner = (
    <span className="block px-4 py-2 text-center text-[12px] font-bold tracking-wide">
      {text}
    </span>
  );

  return (
    <div className="bg-red text-white">
      {a.url ? (
        <a href={a.url} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
