import { EntityListPage } from "@/components/admin/EntityListPage";
import { GALLERY_SPEC } from "@/lib/admin/specs";

export default function Page() {
  return <EntityListPage spec={GALLERY_SPEC} />;
}
