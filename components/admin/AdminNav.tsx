"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Контент",
    items: [
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/programs", label: "Направления" },
      { href: "/admin/gallery", label: "Галерея" },
      { href: "/admin/pricing", label: "Цены" },
      { href: "/admin/schedule", label: "Расписание" },
      { href: "/admin/coaches", label: "Тренеры" },
      { href: "/admin/testimonials", label: "Отзывы" },
      { href: "/admin/shop", label: "Pro Shop" },
      { href: "/admin/contacts", label: "Контакты" },
    ],
  },
  {
    title: "Маркетинг",
    items: [{ href: "/admin/advertising", label: "Реклама" }],
  },
  {
    title: "Сайт",
    items: [
      { href: "/admin/navigation", label: "Навигация" },
      { href: "/admin/announcement", label: "Объявление" },
      { href: "/admin/settings", label: "Общие настройки" },
      { href: "/admin/seo", label: "SEO" },
    ],
  },
];

export function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const link = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        className={`block rounded-md px-3 py-2 ${
          active ? "bg-[#26262c] font-bold" : "text-[var(--a-muted)] hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="border-b border-[var(--a-line)] md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-4 py-4 md:block">
        <Link href="/admin" className="text-lg font-black tracking-wide">
          CANGUR<span className="text-[var(--a-muted)]"> / admin</span>
        </Link>
        <button
          type="button"
          className="admin-btn md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          Меню
        </button>
      </div>

      <nav className={`${open ? "block" : "hidden"} px-3 pb-4 md:block`}>
        {link("/admin", "Дашборд")}
        {GROUPS.map((g) => (
          <div key={g.title} className="mt-4">
            <p className="px-3 pb-1 text-[11px] font-black uppercase tracking-wider text-[var(--a-muted)]">
              {g.title}
            </p>
            {g.items.map((i) => link(i.href, i.label))}
          </div>
        ))}
        <div className="mt-6 border-t border-[var(--a-line)] pt-3">
          <p className="px-3 pb-1 text-[11px] text-[var(--a-muted)]">{email}</p>
          {link("/admin/account", "Пароль")}
        </div>
      </nav>
    </aside>
  );
}
