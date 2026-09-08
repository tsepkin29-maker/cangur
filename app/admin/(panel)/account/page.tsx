"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) {
      setMsg({ ok: false, text: "Пароль должен быть не короче 8 символов." });
      return;
    }
    if (pw !== pw2) {
      setMsg({ ok: false, text: "Пароли не совпадают." });
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    setMsg(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: "Пароль обновлён." },
    );
    if (!error) {
      setPw("");
      setPw2("");
    }
  };

  return (
    <div className="flex max-w-[420px] flex-col gap-5">
      <h1 className="text-xl font-black">Смена пароля</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-[13px] text-[var(--a-muted)]">
          Новый пароль
          <input
            type="password"
            className="a-input"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-[13px] text-[var(--a-muted)]">
          Повторите пароль
          <input
            type="password"
            className="a-input"
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
        </label>
        {msg ? (
          <p
            className="text-[13px]"
            style={{ color: msg.ok ? "#5ecb7a" : "#ff6b81" }}
          >
            {msg.text}
          </p>
        ) : null}
        <button className="a-btn a-btn--primary" disabled={busy}>
          {busy ? "…" : "Обновить пароль"}
        </button>
      </form>
    </div>
  );
}
