import { defineRouting } from "next-intl/routing";

export const locales = ["ru", "ro", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every language gets its own indexable path: /ru, /ro, /en.
  // "/" is redirected to the default locale by the middleware.
  localePrefix: "always",
});
