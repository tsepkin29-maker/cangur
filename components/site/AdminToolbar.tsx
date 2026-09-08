"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** section anchor id -> admin editor path */
const SECTION_EDIT: Record<string, string> = {
  top: "/admin/hero",
  programs: "/admin/programs",
  gallery: "/admin/gallery",
  prices: "/admin/pricing",
  schedule: "/admin/schedule",
  shop: "/admin/shop",
  contacts: "/admin/contacts",
};

const TOOLBAR_LINKS = [
  { path: "/admin", label: "Дашборд" },
  { path: "/admin/hero", label: "Hero" },
  { path: "/admin/programs", label: "Направления" },
  { path: "/admin/gallery", label: "Галерея" },
  { path: "/admin/pricing", label: "Цены" },
  { path: "/admin/schedule", label: "Расписание" },
  { path: "/admin/shop", label: "Pro Shop" },
  { path: "/admin/advertising", label: "Реклама" },
  { path: "/admin/contacts", label: "Контакты" },
  { path: "/admin/settings", label: "Настройки" },
];

export default function AdminToolbar() {
  const pathname = usePathname();
  const [anchors, setAnchors] = useState<{ id: string; el: HTMLElement }[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const found: { id: string; el: HTMLElement }[] = [];
    for (const id of Object.keys(SECTION_EDIT)) {
      const el = document.getElementById(id);
      if (el) {
        el.style.position ||= "relative";
        found.push({ id, el });
      }
    }
    document.body.dataset.adminMode = "1";
    const raf = requestAnimationFrame(() => setAnchors(found));
    return () => {
      cancelAnimationFrame(raf);
      delete document.body.dataset.adminMode;
    };
  }, []);

  const editHref = (path: string, id?: string) =>
    `${path}?from=${encodeURIComponent(`${pathname}${id ? `#${id}` : ""}`)}`;

  return (
    <>
      {anchors.map(({ id, el }) =>
        createPortal(
          <Link
            href={editHref(SECTION_EDIT[id], id)}
            data-admin-edit
            className="absolute right-2 top-2 z-30 inline-flex items-center gap-1 rounded-lg border border-red/50 bg-black/70 px-2.5 py-1.5 text-[12px] font-black text-white shadow-[0_0_14px_rgba(237,27,63,0.35)] backdrop-blur-sm hover:bg-red"
          >
            ✎ Редактировать
          </Link>,
          el,
        ),
      )}

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-red/40 bg-[#0c0c0c]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-2.5 text-[13px]">
          <span className="font-black uppercase tracking-wide text-red-soft">
            Режим администратора
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg border border-line px-3 py-1.5 font-bold hover:border-red/60"
            >
              Быстрый переход ▾
            </button>
            {open ? (
              <div className="absolute bottom-full left-0 mb-2 grid w-56 gap-0.5 rounded-xl border border-line bg-[#141414] p-1.5 shadow-xl">
                {TOOLBAR_LINKS.map((l) => (
                  <Link
                    key={l.path}
                    href={editHref(l.path)}
                    className="rounded-md px-2.5 py-1.5 hover:bg-panel-2"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link
            href="/admin"
            className="ml-auto rounded-lg bg-red px-3 py-1.5 font-black text-white"
          >
            Панель управления
          </Link>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-line px-3 py-1.5 font-bold hover:border-red/60"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
