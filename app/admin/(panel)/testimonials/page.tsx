import { EntityListPage } from "@/components/admin/EntityListPage";
import { TESTIMONIALS_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={TESTIMONIALS_SPEC} />;
}
