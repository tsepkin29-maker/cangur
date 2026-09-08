"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "./icons";

export function ImageInput({
  name,
  label,
  value,
  onChange,
  folder = "misc",
  optional,
  help,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  optional?: boolean;
  help?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
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
    onChange(json.url);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-bold">{label}</span>
      <input type="hidden" name={name} value={value} readOnly />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void upload(f);
        }}
        className={`flex items-center gap-4 rounded-[12px] border p-3 transition-colors ${
          drag
            ? "border-[var(--red)] bg-[rgba(237,27,63,0.06)]"
            : "border-[var(--line-2)] bg-[#0e0e10]"
        }`}
      >
        <div className="relative h-[76px] w-[112px] shrink-0 overflow-hidden rounded-[8px] border border-[var(--line)] bg-[#0a0a0b]">
          {value ? (
            <Image src={value} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[var(--text-faint)]">
              <Icon name="image" width={18} height={18} />
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            <button
              type="button"
              className="a-btn a-btn--sm"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              {busy ? "Загрузка…" : value ? "Заменить" : "Загрузить"}
            </button>
            {value && optional ? (
              <button
                type="button"
                className="a-btn a-btn--sm a-btn--danger"
                onClick={() => onChange("")}
              >
                Удалить
              </button>
            ) : null}
          </div>
          <span className="text-[12px] a-faint">
            JPEG, PNG, WebP, AVIF · до 8 МБ · можно перетащить сюда
          </span>
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

      {err ? <span className="text-[12px] text-[var(--red-soft)]">{err}</span> : null}
      {help ? <span className="text-[12px] a-faint">{help}</span> : null}
    </div>
  );
}
