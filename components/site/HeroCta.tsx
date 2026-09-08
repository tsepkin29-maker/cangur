"use client";

import clsx from "clsx";
import { track } from "@/lib/analytics";

export function HeroCta({
  phone,
  label,
  className,
}: {
  phone: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={`tel:${phone}`}
      onClick={() => {
        track("cta_click", { id: "hero_start" });
        track("phone_click", { source: "hero" });
      }}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl bg-red px-5 py-4 text-sm font-black text-white shadow-[0_0_24px_rgba(237,27,63,0.3)] transition-shadow hover:shadow-[0_0_14px_rgba(237,27,63,0.58),0_0_34px_rgba(237,27,63,0.2)]",
        className,
      )}
    >
      {label}
    </a>
  );
}
