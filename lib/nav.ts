/** Section anchors shared by the header, mobile menu and smooth-scroll. */
export const NAV_ITEMS = [
  { id: "programs", key: "programs" },
  { id: "gallery", key: "gallery" },
  { id: "prices", key: "prices" },
  { id: "shop", key: "shop" },
  { id: "schedule", key: "schedule" },
  { id: "coaches", key: "coaches", requiresCoaches: true },
  { id: "contacts", key: "contacts" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
