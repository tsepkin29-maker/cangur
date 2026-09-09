import { defineRouting } from "next-intl/routing";

// Order here drives the language switcher: RO · RU · EN. RO is the
// default (site's primary market is Moldova), so "/" redirects to /ro.
export const locales = ["ro", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ro";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every language gets its own indexable path: /ro, /ru, /en.
  // "/" is redirected to the default locale (/ro) by the middleware.
  localePrefix: "always",
});
