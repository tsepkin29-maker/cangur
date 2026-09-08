"use client";

import { track } from "@/lib/analytics";

export function BookCta({
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
      onClick={() => {
        track("cta_click", { id: "pricing_book" });
        track("phone_click", { source: "pricing" });
      }}
      className="mt-3 flex flex-col gap-1 rounded-2xl border border-red/30 bg-red/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <span className="font-black">{label}</span>
      <span className="font-black text-red-soft">{phoneDisplay}</span>
    </a>
  );
}
