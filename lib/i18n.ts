import type { Locale } from "@/i18n/routing";
import type { Localized } from "@/lib/content/types";

/** Resolve a localized content value for the active locale.
 *  Accepts a plain string (next-intl's getLocale() is untyped) and
 *  falls back to Russian for anything unexpected. */
export function pick(value: Localized, locale: Locale | string): string {
  return value[locale as Locale] ?? value.ru;
}

/** Optional localized value. */
export function pickMaybe(
  value: Localized | null | undefined,
  locale: Locale | string,
): string | null {
  return value ? pick(value, locale) : null;
}
