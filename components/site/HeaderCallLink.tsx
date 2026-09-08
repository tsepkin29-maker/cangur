"use client";

import clsx from "clsx";
import { track } from "@/lib/analytics";

export function HeaderCallLink({
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
      onClick={() => track("phone_click", { source: "header" })}
      className={clsx(
        "items-center rounded-xl bg-red px-3.5 py-2.5 text-[13px] font-black text-white shadow-[0_0_18px_rgba(237,27,63,0.26)] transition-shadow hover:shadow-[0_0_14px_rgba(237,27,63,0.58),0_0_34px_rgba(237,27,63,0.2)]",
        className,
      )}
    >
      {label}
    </a>
  );
}
