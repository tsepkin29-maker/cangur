"use client";

import clsx from "clsx";
import { track } from "@/lib/analytics";

export function RouteButton({
  mapUrl,
  label,
  className,
}: {
  mapUrl: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("maps_click", { source: "location_card" })}
      className={clsx(
        "inline-flex w-max items-center rounded-xl bg-red px-4 py-3 text-sm font-black text-white shadow-[0_0_18px_rgba(237,27,63,0.26)]",
        className,
      )}
    >
      {label}
    </a>
  );
}

export function ContactLinks({
  labels,
  phone,
  phoneDisplay,
  instagramUrl,
  instagramHandle,
  mapUrl,
  address,
}: {
  labels: { phone: string; instagram: string; address: string };
  phone: string;
  phoneDisplay: string;
  instagramUrl: string;
  instagramHandle: string;
  mapUrl: string;
  address: string;
}) {
  const row =
    "flex items-center justify-between gap-4 border-b border-line py-3.5 font-bold last:border-b-0 hover:text-red-soft";
  return (
    <div className="rounded-card border border-line bg-panel p-5">
      <a
        href={`tel:${phone}`}
        onClick={() => track("phone_click", { source: "contacts" })}
        className={row}
      >
        <span className="text-[13px] font-extrabold uppercase tracking-wide text-faint">
          {labels.phone}
        </span>
        <span>{phoneDisplay}</span>
      </a>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("instagram_click", { source: "contacts" })}
        className={row}
      >
        <span className="text-[13px] font-extrabold uppercase tracking-wide text-faint">
          {labels.instagram}
        </span>
        <span>{instagramHandle}</span>
      </a>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("maps_click", { source: "contacts" })}
        className={row}
      >
        <span className="text-[13px] font-extrabold uppercase tracking-wide text-faint">
          {labels.address}
        </span>
        <span className="text-right">{address}</span>
      </a>
    </div>
  );
}
