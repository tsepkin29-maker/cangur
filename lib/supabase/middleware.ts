import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Refreshes the Supabase auth cookie for /admin requests and, when the
 * path needs auth, checks the session + `is_admin()` and redirects to
 * the login screen if it's missing. Runs inside proxy.ts.
 */
export async function updateAdminSession(
  request: NextRequest,
): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  // Login screen and the auth callback must stay reachable.
  const isPublicAdminPath =
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname.startsWith("/admin/auth");

  if (!isSupabaseConfigured) {
    // No backend yet: only the login screen renders (it shows a notice).
    if (!isPublicAdminPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublicAdminPath) {
    // Already signed in as admin? skip the login screen.
    if (user) {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "forbidden");
    return NextResponse.redirect(url);
  }

  return response;
}
