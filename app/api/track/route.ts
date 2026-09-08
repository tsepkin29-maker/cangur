import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Analytics sink (stub).
 *
 * STEP 13 replaces the body with a real writer (Vercel Analytics custom
 * event and/or insert into `analytics_events`). For now it validates the
 * shape and returns 204 so the client `track()` helper is already wired.
 */

const EventSchema = z.object({
  event: z.enum([
    "phone_click",
    "instagram_click",
    "maps_click",
    "pricing_view",
    "schedule_view",
    "ad_impression",
    "ad_click",
    "shop_product_open",
    "language_change",
    "cta_click",
  ]),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
  path: z.string().max(512),
  ts: z.number(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = EventSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(null, { status: 422 });
  }

  // TODO(STEP 13): persist parsed.data
  return new NextResponse(null, { status: 204 });
}
