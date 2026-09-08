import { EntityListPage } from "@/components/admin/EntityListPage";
import { PRODUCTS_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={PRODUCTS_SPEC} />;
}
