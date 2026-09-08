import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Request-scoped Supabase client bound to the user's auth cookies.
 * Use in Server Components, Route Handlers and Server Actions where the
 * call should run *as the signed-in user* (RLS applies).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // called from a Server Component — safe to ignore, the proxy
          // (middleware) refreshes the session cookie instead.
        }
      },
    },
  });
}
