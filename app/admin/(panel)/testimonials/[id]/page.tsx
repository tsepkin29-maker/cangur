import { EntityEditPage } from "@/components/admin/EntityEditPage";
import { TESTIMONIALS_SPEC } from "@/lib/admin/specs";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntityEditPage spec={TESTIMONIALS_SPEC} id={id} />;
}
