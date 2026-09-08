import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AdminSession = {
  userId: string;
  email: string | null;
};

/**
 * Returns the current admin session, or null. Server-side truth:
 * a valid Supabase session AND a row in `admin_users` (checked by the
 * `is_admin()` RPC, which is also what RLS uses for every write).
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return null;

  return { userId: user.id, email: user.email ?? null };
});

/** Guard for admin pages / layouts. Redirects to the login screen. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Guard for Server Actions — throws instead of redirecting. */
export async function assertAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
