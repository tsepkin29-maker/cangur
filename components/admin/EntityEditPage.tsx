import Link from "next/link";
import { getRow, listCoachOptions } from "@/lib/admin/read";
import type { EntitySpec } from "@/lib/admin/entity";
import { saveEntity, type FormState } from "@/lib/admin/entity-action";
import { EntityForm } from "./EntityForm";

export async function EntityEditPage({
  spec,
  id,
  from,
}: {
  spec: EntitySpec;
  id: string;
  from?: string | null;
}) {
  const isNew = id === "new";
  const values = isNew ? {} : ((await getRow(spec.table, id)) ?? {});

  let fields = spec.fields;
  if (spec.table === "schedule_slots") {
    const coachOptions = await listCoachOptions();
    fields = fields.map((f) =>
      f.name === "coach_id" ? { ...f, options: coachOptions } : f,
    );
  }

  const action = saveEntity.bind(null, spec.table, fields) as (
    prev: FormState,
    fd: FormData,
  ) => Promise<FormState>;

  const backHref =
    spec.listPath + (from ? `?from=${encodeURIComponent(from)}` : "");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={backHref} className="admin-btn">
          ← Назад
        </Link>
        {from ? (
          <a href={from} className="admin-btn">
            ← Вернуться на сайт
          </a>
        ) : null}
        <h1 className="text-xl font-black">
          {isNew ? `Новый: ${spec.title}` : `Редактирование: ${spec.title}`}
        </h1>
      </div>
      <EntityForm
        action={action}
        fields={fields}
        values={values}
        isNew={isNew}
        from={from}
        listPath={spec.listPath}
      />
    </div>
  );
}
