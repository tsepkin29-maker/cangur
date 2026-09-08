"use client";

import Image from "next/image";
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
      <p className="text-sm text-[var(--a-muted)]">
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
    <form onSubmit={signIn} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-[var(--a-muted)]">Email</span>
        <input
          className="a-input"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-[var(--a-muted)]">Пароль</span>
        <input
          className="a-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {msg ? <p className="text-[13px] text-[#ff6b81]">{msg}</p> : null}
      <button className="a-btn a-btn--primary mt-1 justify-center py-3" disabled={busy}>
        {busy ? "…" : "Войти"}
      </button>
      <button
        type="button"
        className="self-start text-[13px] text-[var(--a-muted)] hover:text-white"
        onClick={forgot}
      >
        Забыли пароль?
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5">
      <div className="w-full max-w-[360px]">
        <div className="mb-8 flex items-center gap-3">
          <Image
            src="/brand/logo.webp"
            alt="Cangur"
            width={52}
            height={52}
            priority
            className="h-12 w-12"
          />
          <div className="leading-tight">
            <p
              className="text-xl font-black tracking-[0.06em]"
              style={{ fontFamily: "var(--font-onest), sans-serif" }}
            >
              CANGUR
            </p>
            <p className="text-[12px] text-[var(--a-muted)]">Управление сайтом</p>
          </div>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
