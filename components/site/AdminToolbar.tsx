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

export default function AdminToolbar() {
  const pathname = usePathname();
  const [anchors, setAnchors] = useState<{ id: string; el: HTMLElement }[]>([]);

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

      {/* compact floating pill */}
      <div className="fixed bottom-3 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/12 bg-[#0c0c0d]/95 px-3 py-1.5 text-[12px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-red-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-red" />
          CANGUR ADMIN
        </span>
        <span className="h-3.5 w-px bg-white/15" />
        <Link href="/admin" className="text-white/80 hover:text-white">
          Панель
        </Link>
        <form action="/admin/logout" method="post">
          <button type="submit" className="text-white/50 hover:text-white">
            Выйти
          </button>
        </form>
      </div>
    </>
  );
}
