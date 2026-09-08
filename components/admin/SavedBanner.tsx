"use client";

import { useState } from "react";

/** Shown after a successful save. No auto-redirect. */
export function SavedBanner({
  from,
  listPath,
  savedAt,
}: {
  from?: string | null;
  listPath?: string;
  savedAt?: number;
}) {
  const [dismissed, setDismissed] = useState<number | null>(null);
  if (!savedAt || dismissed === savedAt) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#2e5a3a] bg-[#12271a] px-4 py-3">
      <span className="font-black text-[#5ecb7a]">Сохранено ✓</span>
      {from ? (
        <a href={from} className="admin-btn admin-btn--primary">
          Посмотреть на сайте
        </a>
      ) : null}
      <button
        type="button"
        className="admin-btn"
        onClick={() => setDismissed(savedAt)}
      >
        Продолжить редактирование
      </button>
      {listPath ? (
        <a href={listPath} className="admin-btn">
          К списку
        </a>
      ) : null}
    </div>
  );
}
