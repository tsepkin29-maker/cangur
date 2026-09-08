import { EntityListPage } from "@/components/admin/EntityListPage";
import { TESTIMONIALS_SPEC } from "@/lib/admin/specs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return <EntityListPage spec={TESTIMONIALS_SPEC} from={from ?? null} />;
}
