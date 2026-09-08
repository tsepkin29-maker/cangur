import { EntityListPage } from "@/components/admin/EntityListPage";
import { ADS_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={ADS_SPEC} />;
}
