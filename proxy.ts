import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateAdminSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Next.js 16 "proxy" (formerly middleware).
 *   - /admin/**  → Supabase session refresh + admin gate
 *   - everything else → next-intl locale routing ("/" → "/ru", etc.)
 */
export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateAdminSession(request);
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
