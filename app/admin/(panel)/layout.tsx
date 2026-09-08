import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

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
