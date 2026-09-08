/**
 * Content access layer.
 *
 * Public sections import their data only through these getters. When
 * Supabase is configured the data comes from the CMS (cached + tag-based
 * revalidation, so a Save in /admin is live immediately). Otherwise the
 * site falls back to lib/content/seed.ts and nothing breaks.
 */

import "server-only";
import { unstable_cache } from "next/cache";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "./tags";
import * as seed from "./seed";
import {
  mapAdvertisement,
  mapCoach,
  mapGalleryImage,
  mapHero,
  mapNavItem,
  mapPricingPlan,
  mapProduct,
  mapProgram,
  mapScheduleSlot,
  mapSettings,
  mapTestimonial,
} from "./map";
import type {
  AdPlacement,
  Advertisement,
  Coach,
  GalleryImage,
  Hero,
  NavItem,
  PricingPlan,
  Product,
  Program,
  ScheduleSlot,
  SiteSettings,
  Testimonial,
} from "./types";

const REVALIDATE = 300;

/** Wrap a DB reader with cache + tag; on any failure fall back to seed. */
function cached<T>(
  key: string,
  tag: string,
  read: () => Promise<T>,
  fallback: () => T,
) {
  const runner = unstable_cache(
    async () => {
      if (!isSupabaseConfigured) return fallback();
      try {
        return await read();
      } catch (err) {
        console.warn(`[content] ${key} read failed, using seed:`, err);
        return fallback();
      }
    },
    ["content", key],
    { tags: [tag], revalidate: REVALIDATE },
  );
  return runner;
}

const bySort = <T extends { sortOrder: number }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder;

// --- settings -------------------------------------------------------------
export const getSettings = cached<SiteSettings>(
  "settings",
  CONTENT_TAGS.settings,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb.from("settings").select("*").eq("id", true).single();
    if (error || !data) throw error ?? new Error("no settings row");
    return mapSettings(data);
  },
  () => seed.settings,
);

// --- hero ---------------------------------------------------------------
export const getHero = cached<Hero>(
  "hero",
  CONTENT_TAGS.hero,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb.from("hero").select("*").eq("id", true).single();
    if (error || !data) throw error ?? new Error("no hero row");
    return mapHero(data);
  },
  () => seed.hero,
);

// --- nav ---------------------------------------------------------------
export const getNavItems = cached<NavItem[]>(
  "nav",
  CONTENT_TAGS.nav,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb
      .from("nav_items")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapNavItem);
  },
  () => seed.navItems,
);

// --- programs --------------------------------------------------------------
export const getPrograms = cached<Program[]>(
  "programs",
  CONTENT_TAGS.programs,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb
      .from("programs")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapProgram);
  },
  () => seed.programs.filter((p) => p.active).sort(bySort),
);

// --- pricing --------------------------------------------------------------
export const getPricingPlans = cached<PricingPlan[]>(
  "pricing",
  CONTENT_TAGS.pricing,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb
      .from("pricing_plans")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapPricingPlan);
  },
  () => seed.pricingPlans.filter((p) => p.active).sort(bySort),
);

// --- schedule -----------------------------------------------------------
export const getScheduleSlots = cached<ScheduleSlot[]>(
  "schedule",
  CONTENT_TAGS.schedule,
  async () => {
    const sb = createSupabasePublicClient();
    const [slotsRes, coachesRes] = await Promise.all([
      sb
        .from("schedule_slots")
        .select("*")
        .eq("active", true)
        .order("day_of_week")
        .order("sort_order"),
      sb.from("coaches").select("id, name"),
    ]);
    if (slotsRes.error) throw slotsRes.error;
    const names = new Map(
      (coachesRes.data ?? []).map((c) => [c.id, c.name] as const),
    );
    return (slotsRes.data ?? []).map((row) =>
      mapScheduleSlot(row, row.coach_id ? (names.get(row.coach_id) ?? null) : null),
    );
  },
  () =>
    seed.scheduleSlots
      .filter((s) => s.active)
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.sortOrder - b.sortOrder),
);

// --- coaches ----------------------------------------------------------
export const getCoaches = cached<Coach[]>(
  "coaches",
  CONTENT_TAGS.coaches,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb
      .from("coaches")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapCoach);
  },
  () => seed.coaches.filter((c) => c.active).sort(bySort),
);

// --- gallery ----------------------------------------------------------
export const getGalleryImages = cached<GalleryImage[]>(
  "gallery",
  CONTENT_TAGS.gallery,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb
      .from("gallery_images")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapGalleryImage);
  },
  () => seed.galleryImages.filter((g) => g.active).sort(bySort),
);

// --- products -------------------------------------------------------------
export const getProducts = cached<Product[]>(
  "products",
  CONTENT_TAGS.products,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapProduct);
  },
  () => seed.products.filter((p) => p.active).sort(bySort),
);

// --- testimonials -------------------------------------------------------
export const getTestimonials = cached<Testimonial[]>(
  "testimonials",
  CONTENT_TAGS.testimonials,
  async () => {
    const sb = createSupabasePublicClient();
    const { data, error } = await sb
      .from("testimonials")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapTestimonial);
  },
  () => seed.testimonials.filter((t) => t.active).sort(bySort),
);

// --- advertisements ---------------------------------------------------
const getAllLiveAds = cached<Advertisement[]>(
  "ads",
  CONTENT_TAGS.ads,
  async () => {
    const sb = createSupabasePublicClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await sb
      .from("advertisements")
      .select("*")
      .eq("active", true)
      .or(`start_date.is.null,start_date.lte.${nowIso}`)
      .or(`end_date.is.null,end_date.gte.${nowIso}`)
      .order("priority", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapAdvertisement);
  },
  () => seed.advertisements,
);

export async function getAds(placement: AdPlacement): Promise<Advertisement[]> {
  const all = await getAllLiveAds();
  const now = Date.now();
  return all
    .filter((ad) => ad.placement === placement && ad.active)
    .filter((ad) => !ad.startDate || Date.parse(ad.startDate) <= now)
    .filter((ad) => !ad.endDate || Date.parse(ad.endDate) >= now)
    .sort((a, b) => b.priority - a.priority);
}
