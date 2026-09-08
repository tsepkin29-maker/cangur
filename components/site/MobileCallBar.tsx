"use client";

import { track } from "@/lib/analytics";

/** Fixed bottom "call" action on phones only (legacy `.mobile`). */
export function MobileCallBar({
  phone,
  phoneDisplay,
  label,
}: {
  phone: string;
  phoneDisplay: string;
  label: string;
}) {
  return (
    <a
      href={`tel:${phone}`}
      onClick={() => track("phone_click", { source: "mobile_bar" })}
      className="fixed inset-x-2 bottom-2 z-30 rounded-xl bg-red px-4 py-4 text-center text-sm font-black text-white shadow-[0_0_18px_rgba(237,27,63,0.26)] sm:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {label} · {phoneDisplay}
    </a>
  );
}
