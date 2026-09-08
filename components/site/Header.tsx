import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getNavItems, getSettings } from "@/lib/content";
import { pick } from "@/lib/i18n";
import type { NavKey } from "@/lib/content/types";
import { LangSwitcher } from "./LangSwitcher";
import { MobileNav } from "./MobileNav";
import { HeaderCallLink } from "./HeaderCallLink";

const FALLBACK_KEYS: NavKey[] = [
  "programs",
  "gallery",
  "prices",
  "shop",
  "schedule",
  "coaches",
  "contacts",
];

export async function Header({ showCoaches = false }: { showCoaches?: boolean }) {
  const [locale, t, settings, navItems] = await Promise.all([
    getLocale(),
    getTranslations("nav"),
    getSettings(),
    getNavItems(),
  ]);

  const items = (navItems.length ? navItems : FALLBACK_KEYS.map((key, i) => ({
    key,
    label: {},
    visible: true,
    sortOrder: i,
  })))
    .filter((i) => i.visible)
    .filter((i) => showCoaches || i.key !== "coaches")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((i) => ({ key: i.key, label: pick(i.label, locale) || t(i.key) }));

  const callLabel = pick(settings.ctaCallLabel, locale) || t("call");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-xl">
      <Container className="flex h-[var(--header-h)] items-center gap-4">
        <a href="#top" className="mr-auto flex items-center gap-2.5">
          <Image
            src={settings.logoUrl || "/brand/logo.webp"}
            alt={settings.clubName}
            width={48}
            height={48}
            priority
            className="h-11 w-11 sm:h-12 sm:w-12"
          />
          <span className="leading-none">
            <span className="block font-display text-lg font-black tracking-[0.06em]">
              CANGUR
            </span>
            <span className="block text-[9px] tracking-[0.14em] text-faint">
              BOXING CLUB &amp; GYM
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-[13px] font-extrabold lg:flex">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="group relative py-1 text-[#c8c8c8] transition-colors hover:text-white"
            >
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <LangSwitcher className="hidden sm:flex" />
        <HeaderCallLink
          phone={settings.phoneHref}
          label={callLabel}
          className="hidden md:inline-flex"
        />
        <MobileNav
          items={items}
          phone={settings.phoneHref}
          callLabel={callLabel}
        />
      </Container>
    </header>
  );
}
