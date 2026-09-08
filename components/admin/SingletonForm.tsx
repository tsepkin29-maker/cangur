import { getSingleton } from "@/lib/admin/read";
import type { FieldSpec } from "@/lib/admin/entity";
import { saveSingletonEntity, type FormState } from "@/lib/admin/entity-action";
import { EntityForm } from "./EntityForm";

export async function SingletonForm({
  table,
  title,
  fields,
  description,
  from,
}: {
  table: "settings" | "hero";
  title: string;
  fields: FieldSpec[];
  description?: string;
  from?: string | null;
}) {
  const values = await getSingleton(table);
  const action = saveSingletonEntity.bind(null, table, fields) as (
    prev: FormState,
    fd: FormData,
  ) => Promise<FormState>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-black">{title}</h1>
        {from ? (
          <a href={from} className="admin-btn">
            ← Вернуться на сайт
          </a>
        ) : null}
      </div>
      {description ? (
        <p className="-mt-2 text-[13px] text-[var(--a-muted)]">{description}</p>
      ) : null}
      <EntityForm action={action} fields={fields} values={values} from={from} />
    </div>
  );
}
