/**
 * One-time content seed: pushes lib/content/seed.ts into the CMS tables.
 * Idempotent-ish — clears the content tables first, then inserts.
 *
 *   npx tsx scripts/seed-db.mts
 */
import { createClient } from "@supabase/supabase-js";
import {
  settings,
  hero,
  navItems,
  programs,
  pricingPlans,
  scheduleSlots,
  galleryImages,
  products,
  testimonials,
} from "../lib/content/seed";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) throw new Error("Missing Supabase env");

const sb = createClient(url, key, { auth: { persistSession: false } });

const ok = (label: string, error: { message: string } | null) => {
  if (error) {
    console.error(`✗ ${label}:`, error.message);
    process.exitCode = 1;
  } else console.log(`✓ ${label}`);
};

// --- settings (singleton) ------------------------------------------------
{
  const { error } = await sb.from("settings").upsert({
    id: true,
    club_name: settings.clubName,
    phone: settings.phone,
    phone_secondary: settings.phoneSecondary,
    email: settings.email,
    instagram_url: settings.instagramUrl,
    telegram_url: settings.telegramUrl,
    facebook_url: settings.facebookUrl,
    address: settings.addressLine,
    map_url: settings.mapUrl,
    working_hours: settings.workHours,
    hours_open: settings.hoursOpen,
    hours_close: settings.hoursClose,
    location_image_url: settings.locationImageUrl,
    default_currency: settings.currency,
    price_range: settings.priceRange,
    cta_call_label: settings.ctaCallLabel,
    route_cta_label: settings.routeCtaLabel,
    book_cta_label: settings.bookCtaLabel,
    default_cta_label: settings.defaultCtaLabel,
    default_cta_url: settings.defaultCtaUrl,
    announcement_text: settings.announcement.text,
    announcement_url: settings.announcement.url,
    announcement_active: settings.announcement.active,
    logo_url: settings.logoUrl,
    og_image_url: settings.ogImageUrl,
    seo_title: settings.seo.title,
    seo_description: settings.seo.description,
    og_title: settings.seo.ogTitle,
    og_description: settings.seo.ogDescription,
  });
  ok("settings", error);
}

// --- hero (singleton) --------------------------------------------------
{
  const { error } = await sb.from("hero").upsert({
    id: true,
    kicker: hero.kicker,
    headline: hero.headline,
    subtitle: hero.subtitle,
    cta_label: hero.ctaLabel,
    cta_url: hero.ctaUrl,
    cta_enabled: hero.ctaEnabled,
    video_enabled: hero.videoEnabled,
    poster_url: hero.posterUrl,
    video_desktop_url: hero.videoDesktopUrl,
    video_mobile_url: hero.videoMobileUrl,
  });
  ok("hero", error);
}

// --- nav_items -------------------------------------------------------
{
  const { error } = await sb.from("nav_items").upsert(
    navItems.map((n) => ({
      key: n.key,
      label: n.label,
      visible: n.visible,
      sort_order: n.sortOrder,
    })),
  );
  ok("nav_items", error);
}

// --- programs -------------------------------------------------------
{
  await sb.from("programs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await sb.from("programs").insert(
    programs.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.text,
      image_url: p.image,
      badge: p.badge,
      cta_label: p.ctaLabel,
      cta_url: p.ctaUrl,
      active: p.active,
      sort_order: p.sortOrder,
    })),
  );
  ok("programs", error);
}

// --- pricing_plans -------------------------------------------------------
{
  await sb.from("pricing_plans").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await sb.from("pricing_plans").insert(
    pricingPlans.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      price: p.price,
      old_price: p.oldPrice,
      currency: p.currency,
      period: p.period,
      period_label: p.periodLabel,
      sessions_count: p.sessionsCount,
      badge: p.badge,
      featured: p.featured,
      cta_label: p.ctaLabel,
      cta_url: p.ctaUrl,
      active: p.active,
      sort_order: p.sortOrder,
    })),
  );
  ok("pricing_plans", error);
}

// --- schedule_slots -----------------------------------------------------
{
  await sb.from("schedule_slots").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await sb.from("schedule_slots").insert(
    scheduleSlots.map((s) => ({
      day_of_week: s.dayOfWeek,
      time_label: s.time,
      by_arrangement: s.byArrangement,
      title: s.title,
      level: s.level,
      audience: s.audience,
      age_label: s.ageLabel,
      hall: s.hall,
      note: s.note,
      active: s.active,
      sort_order: s.sortOrder,
    })),
  );
  ok("schedule_slots", error);
}

// --- gallery_images ---------------------------------------------------
{
  await sb.from("gallery_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await sb.from("gallery_images").insert(
    galleryImages.map((g) => ({
      image_url: g.src,
      alt: g.alt,
      caption: g.caption,
      active: g.active,
      sort_order: g.sortOrder,
    })),
  );
  ok("gallery_images", error);
}

// --- products -------------------------------------------------------
{
  await sb.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await sb.from("products").insert(
    products.map((p) => ({
      slug: p.slug,
      title: p.title,
      spec: p.spec,
      description: p.description,
      price: p.price,
      old_price: p.oldPrice,
      currency: p.currency,
      image_url: p.image,
      cta_label: p.ctaLabel,
      cta_url: p.ctaUrl,
      active: p.active,
      sort_order: p.sortOrder,
    })),
  );
  ok("products", error);
}

// --- testimonials ---------------------------------------------------
{
  await sb.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await sb.from("testimonials").insert(
    testimonials.map((tst) => ({
      author: tst.author,
      body: tst.text,
      avatar_url: tst.avatar,
      active: tst.active,
      sort_order: tst.sortOrder,
    })),
  );
  ok("testimonials", error);
}

console.log("\nSeed complete.");
