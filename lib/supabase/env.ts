/**
 * Central check for whether Supabase is wired up yet.
 *
 * Until the project credentials land in .env.local the public site keeps
 * rendering from lib/content/seed.ts, so nothing breaks. The admin panel
 * is disabled while this is false.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY,
);

export const isSupabaseAdminConfigured = Boolean(
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY,
);
