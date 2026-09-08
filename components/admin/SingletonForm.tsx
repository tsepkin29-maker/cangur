import { getSingleton } from "@/lib/admin/read";
import type { FieldSpec, PreviewKind } from "@/lib/admin/entity";
import { saveSingletonEntity, type FormState } from "@/lib/admin/entity-action";
import { EntityForm } from "./EntityForm";

export async function SingletonForm({
  table,
  title,
  fields,
  description,
  from,
  previewKind,
}: {
  table: "settings" | "hero";
  title: string;
  fields: FieldSpec[];
  description?: string;
  from?: string | null;
  previewKind?: PreviewKind | null;
}) {
  const values = await getSingleton(table);
  const action = saveSingletonEntity.bind(null, table, fields) as (
    prev: FormState,
    fd: FormData,
  ) => Promise<FormState>;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <p className="a-eyebrow">CANGUR CONTROL</p>
        <h1 className="a-title">{title}</h1>
        {description ? <p className="a-meta">{description}</p> : null}
        {from ? (
          <a href={from} className="a-meta hover:text-[var(--text)] w-max">
            ← вернуться на сайт
          </a>
        ) : null}
      </header>

      <EntityForm
        action={action}
        fields={fields}
        values={values}
        from={from}
        previewKind={previewKind ?? null}
      />
    </div>
  );
}
