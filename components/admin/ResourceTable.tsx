"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setActive, reorder, deleteRow } from "@/lib/admin/actions";
import type { EditableTable } from "@/lib/admin/tables";

export type RowView = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  active: boolean;
};

export function ResourceTable({
  table,
  basePath,
  rows,
  addLabel = "Добавить",
  reorderable = true,
  linkQuery = "",
}: {
  table: EditableTable;
  basePath: string;
  rows: RowView[];
  addLabel?: string;
  reorderable?: boolean;
  linkQuery?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(rows);
  const [pending, start] = useTransition();

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    start(async () => {
      await reorder(table, next.map((r) => r.id));
      router.refresh();
    });
  };

  const toggle = (id: string, active: boolean) => {
    setItems((cur) => cur.map((r) => (r.id === id ? { ...r, active } : r)));
    start(async () => {
      await setActive(table, id, active);
      router.refresh();
    });
  };

  const remove = (id: string, title: string) => {
    if (!confirm(`Удалить «${title}»? Это действие необратимо.`)) return;
    start(async () => {
      await deleteRow(table, id);
      setItems((cur) => cur.filter((r) => r.id !== id));
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Link href={`${basePath}/new${linkQuery}`} className="admin-btn admin-btn--primary">
          + {addLabel}
        </Link>
        {pending ? (
          <span className="text-[13px] text-[var(--a-muted)]">Сохранение…</span>
        ) : null}
      </div>

      <ul className="flex flex-col gap-2">
        {items.length === 0 ? (
          <li className="admin-card p-4 text-[var(--a-muted)]">Пока пусто.</li>
        ) : null}
        {items.map((r, i) => (
          <li
            key={r.id}
            className="admin-card flex items-center gap-3 p-3"
            style={{ opacity: r.active ? 1 : 0.55 }}
          >
            {reorderable ? (
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label="Вверх"
                  className="admin-btn px-2 py-0.5"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Вниз"
                  className="admin-btn mt-1 px-2 py-0.5"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                >
                  ↓
                </button>
              </div>
            ) : null}

            {r.image ? (
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded border border-[var(--a-line)]">
                <Image src={r.image} alt="" fill className="object-cover" sizes="64px" />
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{r.title || "—"}</p>
              {r.subtitle ? (
                <p className="truncate text-[13px] text-[var(--a-muted)]">
                  {r.subtitle}
                </p>
              ) : null}
            </div>

            <label className="flex items-center gap-1.5 text-[12px] text-[var(--a-muted)]">
              <input
                type="checkbox"
                checked={r.active}
                onChange={(e) => toggle(r.id, e.target.checked)}
                className="h-4 w-4 accent-[var(--a-accent)]"
              />
              вкл
            </label>

            <Link href={`${basePath}/${r.id}${linkQuery}`} className="admin-btn">
              Изменить
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => remove(r.id, r.title)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
