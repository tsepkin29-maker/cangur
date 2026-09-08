"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import clsx from "clsx";
import { locales } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { track } from "@/lib/analytics";

export function LangSwitcher({ className }: { className?: string }) {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={clsx(
        "flex gap-1 rounded-xl border border-line p-1",
        isPending && "opacity-60",
        className,
      )}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          aria-current={loc === active ? "true" : undefined}
          onClick={() => {
            if (loc === active) return;
            track("language_change", { from: active, to: loc });
            startTransition(() => router.replace(pathname, { locale: loc }));
          }}
          className={clsx(
            "rounded-lg px-2.5 py-1.5 text-[11px] font-black uppercase transition-colors",
            loc === active
              ? "bg-white text-black"
              : "text-faint hover:text-white",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
