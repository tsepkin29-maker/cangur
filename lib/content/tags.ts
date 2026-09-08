/** Cache tags for public content. Admin mutations revalidate these so a
 *  Save in /admin shows on the public site without a redeploy. */
export const CONTENT_TAGS = {
  settings: "content:settings",
  hero: "content:hero",
  nav: "content:nav",
  programs: "content:programs",
  pricing: "content:pricing",
  schedule: "content:schedule",
  coaches: "content:coaches",
  gallery: "content:gallery",
  products: "content:products",
  testimonials: "content:testimonials",
  ads: "content:ads",
} as const;

export const ALL_CONTENT_TAGS = Object.values(CONTENT_TAGS);
