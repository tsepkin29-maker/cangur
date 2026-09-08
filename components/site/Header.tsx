import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { NAV_ITEMS } from "@/lib/nav";
import type { SiteSettings } from "@/lib/content/types";
import { LangSwitcher } from "./LangSwitcher";
import { MobileNav } from "./MobileNav";
import { HeaderCallLink } from "./HeaderCallLink";

export function Header({
  settings,
  showCoaches = false,
}: {
  settings: SiteSettings;
  showCoaches?: boolean;
}) {
  const t = useTranslations("nav");
  const items = NAV_ITEMS.filter((i) => showCoaches || !("requiresCoaches" in i));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-xl">
      <Container className="flex h-[var(--header-h)] items-center gap-4">
        <a href="#top" className="mr-auto flex items-center gap-2.5">
          <Image
            src="/brand/logo.webp"
            alt="Cangur Boxing Club & Gym"
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
              key={item.id}
              href={`#${item.id}`}
              className="group relative py-1 text-[#c8c8c8] transition-colors hover:text-white"
            >
              {t(item.key)}
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <LangSwitcher className="hidden sm:flex" />
        <HeaderCallLink
          phone={settings.phone}
          label={t("call")}
          className="hidden md:inline-flex"
        />
        <MobileNav settings={settings} items={items} />
      </Container>
    </header>
  );
}
