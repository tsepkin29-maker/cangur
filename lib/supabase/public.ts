import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Cookie-less anon client for cached public content reads.
 * RLS still applies (anon role) — it only ever sees active rows / live ads.
 * Safe to use inside `unstable_cache`.
 */
export function createSupabasePublicClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
