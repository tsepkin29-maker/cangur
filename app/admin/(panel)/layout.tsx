import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-dvh">
      <AdminHeader />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <AdminNav email={session.email} />
        <main className="min-w-0 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
