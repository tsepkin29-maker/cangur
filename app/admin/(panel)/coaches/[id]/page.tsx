import { EntityEditPage } from "@/components/admin/EntityEditPage";
import { COACHES_SPEC } from "@/lib/admin/specs";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntityEditPage spec={COACHES_SPEC} id={id} />;
}
