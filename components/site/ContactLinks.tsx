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

type Labels = {
  phone: string;
  instagram: string;
  address: string;
  telegram: string;
  email: string;
};

export function ContactLinks({
  labels,
  phone,
  phoneDisplay,
  phoneSecondary,
  email,
  instagramUrl,
  instagramHandle,
  telegramUrl,
  mapUrl,
  address,
}: {
  labels: Labels;
  phone: string;
  phoneDisplay: string;
  phoneSecondary: string | null;
  email: string | null;
  instagramUrl: string | null;
  instagramHandle: string | null;
  telegramUrl: string | null;
  mapUrl: string | null;
  address: string;
}) {
  const row =
    "flex items-center justify-between gap-4 border-b border-line py-3.5 font-bold last:border-b-0 hover:text-red-soft";
  const label =
    "text-[13px] font-extrabold uppercase tracking-wide text-faint";

  return (
    <div className="rounded-card border border-line bg-panel p-5">
      <a
        href={`tel:${phone}`}
        onClick={() => track("phone_click", { source: "contacts" })}
        className={row}
      >
        <span className={label}>{labels.phone}</span>
        <span>{phoneDisplay}</span>
      </a>

      {phoneSecondary ? (
        <a
          href={`tel:${phoneSecondary}`}
          onClick={() => track("phone_click", { source: "contacts_2" })}
          className={row}
        >
          <span className={label}>{labels.phone}</span>
          <span>{phoneSecondary}</span>
        </a>
      ) : null}

      {email ? (
        <a href={`mailto:${email}`} className={row}>
          <span className={label}>{labels.email}</span>
          <span>{email}</span>
        </a>
      ) : null}

      {instagramUrl ? (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("instagram_click", { source: "contacts" })}
          className={row}
        >
          <span className={label}>{labels.instagram}</span>
          <span>{instagramHandle ?? "Instagram"}</span>
        </a>
      ) : null}

      {telegramUrl ? (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={row}
        >
          <span className={label}>{labels.telegram}</span>
          <span>{telegramUrl.replace(/^https?:\/\/(t\.me\/)?/, "@")}</span>
        </a>
      ) : null}

      {mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("maps_click", { source: "contacts" })}
          className={row}
        >
          <span className={label}>{labels.address}</span>
          <span className="text-right">{address}</span>
        </a>
      ) : (
        <div className={row}>
          <span className={label}>{labels.address}</span>
          <span className="text-right">{address}</span>
        </div>
      )}
    </div>
  );
}
