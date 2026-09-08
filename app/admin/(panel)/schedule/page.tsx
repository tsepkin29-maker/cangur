import { EntityListPage } from "@/components/admin/EntityListPage";
import { SCHEDULE_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={SCHEDULE_SPEC} />;
}
