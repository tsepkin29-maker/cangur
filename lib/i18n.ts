import type { Locale } from "@/i18n/routing";
import type { Localized } from "@/lib/content/types";

const ORDER: Locale[] = ["ru", "ro", "en"];

/** Resolve a localised value for the active locale.
 *  Falls back: requested → ru → ro → en → "" . Tolerates a plain string
 *  locale (next-intl's getLocale() is untyped). */
export function pick(
  value: Localized | null | undefined,
  locale: Locale | string,
): string {
  if (!value) return "";
  const direct = value[locale as Locale];
  if (direct && direct.trim()) return direct;
  for (const l of ORDER) {
    const v = value[l];
    if (v && v.trim()) return v;
  }
  return "";
}

/** Optional localised value — returns null when nothing is set. */
export function pickMaybe(
  value: Localized | null | undefined,
  locale: Locale | string,
): string | null {
  const v = pick(value, locale);
  return v ? v : null;
}
