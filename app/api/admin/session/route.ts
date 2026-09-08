import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

/**
 * Tiny endpoint the public site calls to decide whether to show the
 * admin toolbar / edit affordances. Real security is unchanged — this
 * only gates decorative UI. Visitors always get { isAdmin: false }.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json(
    { isAdmin: Boolean(session) },
    { headers: { "cache-control": "no-store" } },
  );
}
