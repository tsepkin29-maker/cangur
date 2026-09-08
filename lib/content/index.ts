/**
 * Content access layer.
 *
 * Every public section imports its data through these async getters.
 * Today they resolve from lib/content/seed.ts; in STEP 8 the bodies
 * are swapped for Supabase queries (same signatures, same return
 * shapes) and nothing downstream changes.
 */

import "server-only";

import type { AdPlacement, Advertisement } from "./types";
import {
  advertisements,
  coaches,
  galleryImages,
  pricingPlans,
  products,
  programs,
  scheduleSlots,
  settings,
  testimonials,
} from "./seed";

const bySort = <T extends { sortOrder: number }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder;
const activeSorted = <T extends { active: boolean; sortOrder: number }>(
  rows: T[],
) => rows.filter((r) => r.active).sort(bySort);

export async function getSettings() {
  return settings;
}

export async function getPrograms() {
  return activeSorted(programs);
}

export async function getPricingPlans() {
  return activeSorted(pricingPlans);
}

export async function getScheduleSlots() {
  return activeSorted(scheduleSlots).sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek || a.sortOrder - b.sortOrder,
  );
}

export async function getCoaches() {
  return activeSorted(coaches);
}

export async function getGalleryImages() {
  return activeSorted(galleryImages);
}

export async function getProducts() {
  return activeSorted(products);
}

export async function getTestimonials() {
  return activeSorted(testimonials);
}

export async function getAds(placement: AdPlacement): Promise<Advertisement[]> {
  const now = Date.now();
  return advertisements
    .filter((ad) => ad.active && ad.placement === placement)
    .filter((ad) => !ad.startDate || Date.parse(ad.startDate) <= now)
    .filter((ad) => !ad.endDate || Date.parse(ad.endDate) >= now)
    .sort((a, b) => b.priority - a.priority);
}
