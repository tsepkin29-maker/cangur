"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "./icons";

type Item = { href: string; label: string; icon: IconName };
type Group = { title?: string; items: Item[] };

const GROUPS: Group[] = [
  { items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }] },
  {
    title: "Сайт",
    items: [{ href: "/admin/hero", label: "Главный экран", icon: "hero" }],
  },
  {
    title: "Контент",
    items: [
      { href: "/admin/programs", label: "Направления", icon: "programs" },
      { href: "/admin/gallery", label: "Галерея", icon: "gallery" },
      { href: "/admin/pricing", label: "Цены", icon: "prices" },
      { href: "/admin/schedule", label: "Расписание", icon: "schedule" },
      { href: "/admin/coaches", label: "Тренеры", icon: "coaches" },
      { href: "/admin/testimonials", label: "Отзывы", icon: "reviews" },
      { href: "/admin/shop", label: "Pro Shop", icon: "shop" },
    ],
  },
  {
    title: "Маркетинг",
    items: [{ href: "/admin/advertising", label: "Реклама", icon: "ads" }],
  },
  {
    title: "Настройки",
    items: [
      { href: "/admin/contacts", label: "Контакты", icon: "contacts" },
      { href: "/admin/navigation", label: "Навигация", icon: "nav" },
      { href: "/admin/seo", label: "SEO", icon: "seo" },
      { href: "/admin/settings", label: "Общие", icon: "settings" },
    ],
  },
];

export function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <aside className={`a-side ${open ? "a-side--open" : ""}`}>
      <div className="a-side__brand">
        <Image src="/brand/logo.webp" alt="" width={30} height={30} className="a-thumb" />
        <span className="a-side__word">CANGUR</span>
      </div>
      <div className="a-side__status">
        <span className="a-dot" /> Site online
      </div>

      <nav className="flex flex-col gap-0.5" onClick={close}>
        {GROUPS.map((g, gi) => (
          <div key={gi}>
            {g.title ? <p className="a-side__group">{g.title}</p> : null}
            {g.items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`a-nav ${isActive(it.href) ? "a-nav--active" : ""}`}
              >
                <Icon name={it.icon} />
                {it.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="a-side__foot flex flex-col gap-0.5">
        <p className="px-2 pb-1 text-[11px] a-faint truncate">{email}</p>
        <Link
          href="/admin/account"
          className={`a-nav ${isActive("/admin/account") ? "a-nav--active" : ""}`}
        >
          <Icon name="user" /> Пароль
        </Link>
        <a href="/ru" target="_blank" rel="noopener noreferrer" className="a-nav">
          <Icon name="external" /> Открыть сайт
        </a>
        <form action="/admin/logout" method="post">
          <button type="submit" className="a-nav w-full" style={{ color: "var(--red-soft)" }}>
            <Icon name="logout" /> Выйти
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <>
      <div className="a-mobilebar">
        <div className="a-row">
          <Image src="/brand/logo.webp" alt="" width={26} height={26} className="a-thumb" />
          <span className="a-side__word">CANGUR</span>
        </div>
        <button
          type="button"
          className="a-btn a-btn--ghost a-btn--sm"
          onClick={() => setOpen(true)}
          aria-label="Меню"
        >
          <Icon name="menu" />
        </button>
      </div>

      {open ? (
        <div className="a-side__scrim" onClick={() => setOpen(false)} />
      ) : null}
      {nav}
    </>
  );
}
