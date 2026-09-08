import { getSingleton } from "@/lib/admin/read";
import type { FieldSpec } from "@/lib/admin/entity";
import { saveSingletonEntity, type FormState } from "@/lib/admin/entity-action";
import { EntityForm } from "./EntityForm";

export async function SingletonForm({
  table,
  title,
  fields,
  description,
}: {
  table: "settings" | "hero";
  title: string;
  fields: FieldSpec[];
  description?: string;
}) {
  const values = await getSingleton(table);
  const action = saveSingletonEntity.bind(null, table, fields) as (
    prev: FormState,
    fd: FormData,
  ) => Promise<FormState>;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-black">{title}</h1>
        {description ? (
          <p className="mt-1 text-[13px] text-[var(--a-muted)]">{description}</p>
        ) : null}
      </div>
      <EntityForm action={action} fields={fields} values={values} />
    </div>
  );
}
