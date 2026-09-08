"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@/lib/analytics";
import { LangSwitcher } from "./LangSwitcher";

type Item = { key: string; label: string };

export function MobileNav({
  items,
  phone,
  callLabel,
}: {
  items: Item[];
  phone: string;
  callLabel: string;
}) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-panel-2"
      >
        <span className="relative block h-3.5 w-5" aria-hidden>
          <span
            className={`absolute left-0 top-0 h-0.5 w-full bg-white transition-transform duration-200 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-full bg-white transition-transform duration-200 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={t("openMenu")}
            className="absolute inset-x-0 top-0 max-h-dvh overflow-y-auto border-b border-line bg-bg px-[var(--site-gutter)] pb-8 pt-[calc(var(--header-h)+8px)]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("closeMenu")}
              className="absolute right-[var(--site-gutter)] top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-panel-2 text-lg leading-none"
            >
              <span aria-hidden>✕</span>
            </button>
            <nav className="flex flex-col divide-y divide-line">
              {items.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  onClick={() => setOpen(false)}
                  className="py-4 font-display text-2xl font-black uppercase tracking-tight"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex items-center justify-between gap-4">
              <LangSwitcher />
              <a
                href={`tel:${phone}`}
                onClick={() => {
                  track("phone_click", { source: "mobile_menu" });
                  setOpen(false);
                }}
                className="rounded-xl bg-red px-4 py-3 text-sm font-black text-white"
              >
                {callLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
