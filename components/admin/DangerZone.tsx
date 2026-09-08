"use client";

import { useState, useTransition } from "react";
import { Icon } from "./icons";

export function DangerZone({
  title,
  onDelete,
}: {
  title: string;
  onDelete: () => Promise<void>;
}) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="mt-4 rounded-[12px] border border-[rgba(237,27,63,0.25)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold">Опасная зона</p>
          <p className="a-meta a-faint">Удаление «{title}» необратимо.</p>
        </div>
        {armed ? (
          <div className="flex gap-2">
            <button className="a-btn a-btn--sm" onClick={() => setArmed(false)}>
              Отмена
            </button>
            <button
              className="a-btn a-btn--sm a-btn--danger"
              disabled={pending}
              onClick={() => start(onDelete)}
            >
              {pending ? "Удаление…" : "Удалить окончательно"}
            </button>
          </div>
        ) : (
          <button
            className="a-btn a-btn--sm a-btn--danger"
            onClick={() => setArmed(true)}
          >
            <Icon name="trash" width={14} height={14} /> Удалить
          </button>
        )}
      </div>
    </div>
  );
}
