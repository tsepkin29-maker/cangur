import type { SVGProps } from "react";

/** Small monochrome line icons (16px, stroke). No emoji. */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type IconName =
  | "dashboard"
  | "overview"
  | "hero"
  | "programs"
  | "gallery"
  | "prices"
  | "schedule"
  | "coaches"
  | "reviews"
  | "shop"
  | "ads"
  | "contacts"
  | "nav"
  | "seo"
  | "settings"
  | "user"
  | "logout"
  | "external"
  | "edit"
  | "plus"
  | "more"
  | "trash"
  | "menu"
  | "close"
  | "check"
  | "image"
  | "arrowLeft";

const PATHS: Record<IconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" />
    </>
  ),
  overview: (
    <>
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </>
  ),
  hero: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 15l5-4 4 3 3-2 6 4" />
      <circle cx="8.5" cy="9" r="1.5" />
    </>
  ),
  programs: (
    <>
      <rect x="3" y="4" width="7" height="16" rx="1.5" />
      <rect x="14" y="4" width="7" height="16" rx="1.5" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M4 17l4-4 3 3 4-5 5 6" />
    </>
  ),
  prices: (
    <>
      <path d="M4 7h16M4 12h16M4 17h10" />
      <circle cx="18" cy="17" r="2" />
    </>
  ),
  schedule: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4M8 14h3M8 17h6" />
    </>
  ),
  coaches: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-4 12.5-4 14 0" />
    </>
  ),
  reviews: (
    <>
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4V7a2 2 0 0 1 2-2z" />
      <path d="M9 10h8M9 13h5" />
    </>
  ),
  shop: (
    <>
      <path d="M4 8h16l-1 12H5L4 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  ads: (
    <>
      <path d="M4 9v6l9 4V5L4 9z" />
      <path d="M13 8l6-2v12l-6-2" />
      <path d="M8 15v3" />
    </>
  ),
  contacts: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M5.5 17c1-2 6-2 7 0M14 9h4M14 13h4" />
    </>
  ),
  nav: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  seo: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-5 14.5-5 16 0" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M14 6l4 4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M4 12l6 6L20 6" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M4 17l5-5 4 4 3-3 4 4" />
    </>
  ),
  arrowLeft: <path d="M15 6l-6 6 6 6" />,
};

export function Icon({
  name,
  ...rest
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...rest} aria-hidden>
      {PATHS[name]}
    </svg>
  );
}
