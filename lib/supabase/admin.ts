import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./env";

/**
 * Service-role client. Bypasses RLS — SERVER ONLY, never import into a
 * Client Component. Used for:
 *   - the analytics sink (/api/track)
 *   - one-off scripts (seed, create admin user)
 *
 * Admin CRUD does NOT use this: it goes through createSupabaseServerClient()
 * so every write is still checked by RLS `is_admin()`.
 */
export function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role is not configured");
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
