"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ImageInput({
  name,
  label,
  defaultValue,
  folder = "misc",
  optional,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder?: string;
  optional?: boolean;
  help?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(json.error || "Не удалось загрузить файл");
      return;
    }
    setUrl(json.url);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold">{label}</span>
      <input type="hidden" name={name} value={url} readOnly />
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-[var(--a-line)] bg-[#101013]">
          {url ? (
            <Image src={url} alt="" fill className="object-cover" sizes="112px" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[11px] text-[var(--a-muted)]">
              нет фото
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            className="admin-btn"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            {busy ? "Загрузка…" : url ? "Заменить" : "Загрузить"}
          </button>
          {url && optional ? (
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => setUrl("")}
            >
              Убрать
            </button>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {err ? <span className="text-[12px] text-[#ff6b81]">{err}</span> : null}
      {help ? (
        <span className="text-[12px] text-[var(--a-muted)]">{help}</span>
      ) : null}
    </div>
  );
}
