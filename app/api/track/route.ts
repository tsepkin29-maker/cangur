import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";

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
  meta: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .default({}),
  path: z.string().max(512).default(""),
  ts: z.number().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = EventSchema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 422 });

  if (isSupabaseAdminConfigured) {
    try {
      const supabase = createSupabaseAdminClient();
      const localeMatch = parsed.data.path.match(/^\/(ru|ro|en)(\/|$)/);
      await supabase.from("analytics_events").insert({
        name: parsed.data.event,
        path: parsed.data.path,
        locale: localeMatch?.[1] ?? null,
        meta: parsed.data.meta,
      });
    } catch {
      // analytics must never break anything
    }
  }

  return new NextResponse(null, { status: 204 });
}
