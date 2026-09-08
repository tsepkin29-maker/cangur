import { EntityListPage } from "@/components/admin/EntityListPage";
import { PROGRAMS_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={PROGRAMS_SPEC} />;
}
