import { EntityListPage } from "@/components/admin/EntityListPage";
import { COACHES_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={COACHES_SPEC} />;
}
