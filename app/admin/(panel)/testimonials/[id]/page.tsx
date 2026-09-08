import { EntityEditPage } from "@/components/admin/EntityEditPage";
import { TESTIMONIALS_SPEC } from "@/lib/admin/specs";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  return <EntityEditPage spec={TESTIMONIALS_SPEC} id={id} from={from ?? null} />;
}
