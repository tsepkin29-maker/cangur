import { EntityListPage } from "@/components/admin/EntityListPage";
import { PRICING_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={PRICING_SPEC} />;
}
