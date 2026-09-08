"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** Browser Supabase client — used by the admin login form and any
 *  client-side auth calls. Content reads happen on the server. */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
