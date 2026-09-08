import { CONTENT_TAGS } from "@/lib/content/tags";

/** Every editable table + the content cache tag its writes must purge. */
export const EDITABLE_TABLES = {
  settings: CONTENT_TAGS.settings,
  hero: CONTENT_TAGS.hero,
  nav_items: CONTENT_TAGS.nav,
  programs: CONTENT_TAGS.programs,
  pricing_plans: CONTENT_TAGS.pricing,
  schedule_slots: CONTENT_TAGS.schedule,
  coaches: CONTENT_TAGS.coaches,
  gallery_images: CONTENT_TAGS.gallery,
  products: CONTENT_TAGS.products,
  testimonials: CONTENT_TAGS.testimonials,
  advertisements: CONTENT_TAGS.ads,
} as const;

export type EditableTable = keyof typeof EDITABLE_TABLES;
