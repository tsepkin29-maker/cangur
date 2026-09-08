"use client";

/**
 * Single analytics abstraction.
 *
 * Components never call a vendor SDK directly — they call `track(...)`.
 * Today events are POSTed to /api/track (which currently just validates
 * and 204s). STEP 13 wires a real sink (Vercel Analytics custom events
 * and/or an `analytics_events` table) behind this one function.
 */

export type AnalyticsEvent =
  | "phone_click"
  | "instagram_click"
  | "maps_click"
  | "pricing_view"
  | "schedule_view"
  | "ad_impression"
  | "ad_click"
  | "shop_product_open"
  | "language_change"
  | "cta_click";

export function track(
  event: AnalyticsEvent,
  meta: Record<string, string | number | boolean | null> = {},
): void {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    event,
    meta,
    path: window.location.pathname,
    ts: Date.now(),
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", payload);
    } else {
      void fetch("/api/track", {
        method: "POST",
        body: payload,
        headers: { "content-type": "application/json" },
        keepalive: true,
      });
    }
  } catch {
    /* analytics must never break the UI */
  }
}
