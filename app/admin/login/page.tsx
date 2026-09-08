"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(
    params.get("error") === "forbidden"
      ? "Этот аккаунт не имеет доступа к админке."
      : null,
  );

  if (!isSupabaseConfigured) {
    return (
      <p className="text-[var(--a-muted)]">
        База данных ещё не подключена. Добавьте переменные Supabase в{" "}
        <code>.env.local</code> и перезапустите сервер.
      </p>
    );
  }

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMsg("Неверный email или пароль.");
      return;
    }
    router.replace(next);
    router.refresh();
  };

  const forgot = async () => {
    if (!email) {
      setMsg("Введите email, затем нажмите «Забыли пароль».");
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/auth/callback?next=/admin/account`,
    });
    setBusy(false);
    setMsg(
      error
        ? "Не удалось отправить письмо. Попробуйте позже."
        : "Письмо для сброса пароля отправлено.",
    );
  };

  return (
    <form onSubmit={signIn} className="flex flex-col gap-3">
      <label className="text-[13px] text-[var(--a-muted)]">
        Email
        <input
          className="admin-input mt-1"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="text-[13px] text-[var(--a-muted)]">
        Пароль
        <input
          className="admin-input mt-1"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {msg ? <p className="text-[13px] text-[#ff6b81]">{msg}</p> : null}
      <button className="admin-btn admin-btn--primary" disabled={busy}>
        {busy ? "…" : "Войти"}
      </button>
      <button
        type="button"
        className="text-left text-[13px] text-[var(--a-muted)] hover:text-white"
        onClick={forgot}
      >
        Забыли пароль?
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[380px] flex-col justify-center px-5">
      <h1 className="mb-1 text-2xl font-black">CANGUR / admin</h1>
      <p className="mb-6 text-[13px] text-[var(--a-muted)]">
        Панель управления сайтом клуба.
      </p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
