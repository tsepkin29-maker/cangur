import { EntityListPage } from "@/components/admin/EntityListPage";
import { ADS_SPEC } from "@/lib/admin/specs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return <EntityListPage spec={ADS_SPEC} from={from ?? null} />;
}
