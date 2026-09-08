import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * The admin panel is auth-gated and reads per-request Supabase data, so it
 * must never be statically prerendered at build time. Forcing dynamic here
 * covers every nested segment (/admin and all /admin/* editors) and keeps
 * the build green regardless of whether env vars are present at build.
 */
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="a-shell">
      <AdminNav email={session.email} />
      <main className="a-main">{children}</main>
    </div>
  );
}
