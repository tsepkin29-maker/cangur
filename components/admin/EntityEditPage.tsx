import Link from "next/link";
import { getRow, listCoachOptions } from "@/lib/admin/read";
import type { EntitySpec } from "@/lib/admin/entity";
import { saveEntity, type FormState } from "@/lib/admin/entity-action";
import { EntityForm } from "./EntityForm";

export async function EntityEditPage({
  spec,
  id,
}: {
  spec: EntitySpec;
  id: string;
}) {
  const isNew = id === "new";
  const values = isNew ? {} : ((await getRow(spec.table, id)) ?? {});

  // Fill runtime select options (coach picker on the schedule form).
  let fields = spec.fields;
  if (spec.table === "schedule_slots") {
    const coachOptions = await listCoachOptions();
    fields = fields.map((f) =>
      f.name === "coach_id" ? { ...f, options: coachOptions } : f,
    );
  }

  const action = saveEntity.bind(
    null,
    spec.table,
    fields,
    spec.listPath,
  ) as (prev: FormState, fd: FormData) => Promise<FormState>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link href={spec.listPath} className="admin-btn">
          ← Назад
        </Link>
        <h1 className="text-xl font-black">
          {isNew ? `Новый: ${spec.title}` : `Редактирование: ${spec.title}`}
        </h1>
      </div>
      <EntityForm action={action} fields={fields} values={values} isNew={isNew} />
    </div>
  );
}
