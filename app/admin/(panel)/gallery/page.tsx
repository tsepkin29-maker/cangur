import { EntityListPage } from "@/components/admin/EntityListPage";
import { GALLERY_SPEC } from "@/lib/admin/specs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return <EntityListPage spec={GALLERY_SPEC} from={from ?? null} />;
}
