import { EntityEditPage } from "@/components/admin/EntityEditPage";
import { GALLERY_SPEC } from "@/lib/admin/specs";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntityEditPage spec={GALLERY_SPEC} id={id} />;
}
