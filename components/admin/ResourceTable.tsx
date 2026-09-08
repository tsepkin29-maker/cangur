"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setActive, reorder, deleteRow } from "@/lib/admin/actions";
import type { EditableTable } from "@/lib/admin/tables";
import { Icon } from "./icons";

export type RowView = {
  id: string;
  title: string;
  subtitle?: string;
  locales?: string[];
  image?: string | null;
  active: boolean;
};

export function ResourceTable({
  table,
  basePath,
  rows,
  reorderable = true,
  linkQuery = "",
}: {
  table: EditableTable;
  basePath: string;
  rows: RowView[];
  reorderable?: boolean;
  linkQuery?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(rows);
  const [pending, start] = useTransition();
  const [menuFor, setMenuFor] = useState<string | null>(null);

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
    setMenuFor(null);
    if (!confirm(`Удалить «${title}»? Действие необратимо.`)) return;
    start(async () => {
      await deleteRow(table, id);
      setItems((cur) => cur.filter((r) => r.id !== id));
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <div className="a-card a-card--pad text-center">
        <p className="a-meta">Пока пусто.</p>
        <Link
          href={`${basePath}/new${linkQuery}`}
          className="a-btn a-btn--sm a-btn--primary mt-3 inline-flex"
        >
          <Icon name="plus" width={14} height={14} /> Добавить
        </Link>
      </div>
    );
  }

  return (
    <div className="a-card divide-y divide-[var(--line)]">
      {pending ? (
        <p className="px-4 py-1.5 text-[12px] a-faint">сохранение…</p>
      ) : null}
      {items.map((r, i) => (
        <Row
          key={r.id}
          r={r}
          i={i}
          last={i === items.length - 1}
          reorderable={reorderable}
          editHref={`${basePath}/${r.id}${linkQuery}`}
          menuOpen={menuFor === r.id}
          onMenu={() => setMenuFor((v) => (v === r.id ? null : r.id))}
          onMove={move}
          onToggle={toggle}
          onDelete={() => remove(r.id, r.title)}
        />
      ))}
    </div>
  );
}

function Row({
  r,
  i,
  last,
  reorderable,
  editHref,
  menuOpen,
  onMenu,
  onMove,
  onToggle,
  onDelete,
}: {
  r: RowView;
  i: number;
  last: boolean;
  reorderable: boolean;
  editHref: string;
  menuOpen: boolean;
  onMenu: () => void;
  onMove: (i: number, dir: -1 | 1) => void;
  onToggle: (id: string, active: boolean) => void;
  onDelete: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex items-center gap-3 px-3.5 py-3"
      style={{ opacity: r.active ? 1 : 0.5 }}
    >
      {reorderable ? (
        <div className="flex flex-col gap-0.5">
          <button
            className="a-btn a-btn--ghost a-btn--sm px-1.5 py-0"
            onClick={() => onMove(i, -1)}
            disabled={i === 0}
            aria-label="Выше"
          >
            <Icon name="arrowLeft" width={13} height={13} style={{ transform: "rotate(90deg)" }} />
          </button>
          <button
            className="a-btn a-btn--ghost a-btn--sm px-1.5 py-0"
            onClick={() => onMove(i, 1)}
            disabled={last}
            aria-label="Ниже"
          >
            <Icon name="arrowLeft" width={13} height={13} style={{ transform: "rotate(-90deg)" }} />
          </button>
        </div>
      ) : null}

      {r.image ? (
        <div className="relative h-11 w-14 shrink-0">
          <Image src={r.image} alt="" fill sizes="56px" className="a-thumb" />
        </div>
      ) : (
        <div className="grid h-11 w-14 shrink-0 place-items-center rounded-[9px] border border-[var(--line)] text-[var(--text-faint)]">
          <Icon name="image" width={16} height={16} />
        </div>
      )}

      <Link href={editHref} className="min-w-0 flex-1">
        <p className="a-card-title truncate">{r.title || "—"}</p>
        <p className="a-meta truncate">
          {r.subtitle ? <span>{r.subtitle}</span> : null}
          {r.subtitle && r.locales?.length ? <span> · </span> : null}
          {r.locales?.length ? (
            <span className="a-faint">{r.locales.join(" · ")}</span>
          ) : null}
        </p>
      </Link>

      <button
        onClick={() => onToggle(r.id, !r.active)}
        className="a-row shrink-0 text-[12px] a-faint"
        style={{ gap: 6 }}
        aria-label={r.active ? "Выключить" : "Включить"}
      >
        <span className={`a-dot ${r.active ? "" : "a-dot--off"}`} />
        {r.active ? "вкл" : "выкл"}
      </button>

      <Link href={editHref} className="a-btn a-btn--sm shrink-0">
        Изменить
      </Link>

      <div className="relative shrink-0">
        <button
          className="a-btn a-btn--ghost a-btn--sm px-1.5"
          onClick={onMenu}
          aria-label="Ещё"
        >
          <Icon name="more" width={16} height={16} />
        </button>
        {menuOpen ? (
          <div ref={menuRef} className="a-menu">
            <button onClick={onDelete} style={{ color: "var(--red-soft)" }}>
              <Icon name="trash" width={14} height={14} /> Удалить
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
