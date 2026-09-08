"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveNav } from "@/lib/admin/actions";

type NavRow = {
  key: string;
  visible: boolean;
  sort_order: number;
  label: Record<string, string>;
};

const DEFAULT_LABEL: Record<string, string> = {
  programs: "Занятия",
  gallery: "Галерея",
  prices: "Цены",
  shop: "Pro Shop",
  schedule: "Расписание",
  coaches: "Тренеры",
  contacts: "Контакты",
};

export function NavigationForm({ rows }: { rows: NavRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(
    [...rows].sort((a, b) => a.sort_order - b.sort_order),
  );
  const [pending, start] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const patch = (key: string, p: Partial<NavRow>) =>
    setItems((cur) => cur.map((r) => (r.key === key ? { ...r, ...p } : r)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next.map((r, idx) => ({ ...r, sort_order: idx + 1 })));
  };

  const save = () =>
    start(async () => {
      setErr(null);
      const res = await saveNav(
        items.map((r, idx) => ({
          key: r.key,
          visible: r.visible,
          sort_order: idx + 1,
          label: r.label,
        })),
      );
      if (!res.ok) setErr(res.error);
      else {
        setSavedAt(Date.now());
        router.refresh();
      }
    });

  return (
    <div className="flex max-w-[720px] flex-col gap-3">
      {items.map((r, i) => (
        <div key={r.key} className="a-card p-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <button className="a-btn px-2 py-0.5" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </button>
              <button
                className="a-btn mt-1 px-2 py-0.5"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
              >
                ↓
              </button>
            </div>
            <div className="flex-1">
              <p className="font-bold">
                {r.label.ru || DEFAULT_LABEL[r.key] || r.key}
                <span className="ml-2 text-[12px] text-[var(--a-muted)]">#{r.key}</span>
              </p>
            </div>
            <label className="flex items-center gap-1.5 text-[12px] text-[var(--a-muted)]">
              <input
                type="checkbox"
                checked={r.visible}
                onChange={(e) => patch(r.key, { visible: e.target.checked })}
                className="h-4 w-4 accent-[var(--a-accent)]"
              />
              показывать
            </label>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {(["ru", "ro", "en"] as const).map((l) => (
              <label key={l} className="flex flex-col gap-1">
                <span className="text-[11px] text-[var(--a-muted)]">
                  {l.toUpperCase()} · своё название
                </span>
                <input
                  className="a-input"
                  placeholder={l === "ru" ? DEFAULT_LABEL[r.key] : ""}
                  value={r.label[l] ?? ""}
                  onChange={(e) =>
                    patch(r.key, { label: { ...r.label, [l]: e.target.value } })
                  }
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      {err ? <p className="text-[13px] text-[#ff6b81]">Ошибка: {err}</p> : null}
      <div className="flex items-center gap-3">
        <button className="a-btn a-btn--primary" onClick={save} disabled={pending}>
          {pending ? "Сохранение…" : "Сохранить"}
        </button>
        {savedAt ? <span className="text-[13px] text-[#5ecb7a]">Сохранено ✓</span> : null}
      </div>
      <p className="text-[12px] text-[var(--a-muted)]">
        Адреса разделов фиксированы. Здесь можно менять только названия, порядок и
        видимость пунктов меню.
      </p>
    </div>
  );
}
