import Link from "next/link";
import { getRow, listCoachOptions } from "@/lib/admin/read";
import type { EntitySpec } from "@/lib/admin/entity";
import {
  saveEntity,
  deleteAndBack,
  type FormState,
} from "@/lib/admin/entity-action";
import { EntityForm } from "./EntityForm";
import { DangerZone } from "./DangerZone";
import { Icon } from "./icons";

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

  const del = deleteAndBack.bind(null, spec.table, id, spec.listPath);
  const backHref =
    spec.listPath + (from ? `?from=${encodeURIComponent(from)}` : "");
  const rowTitle =
    (typeof values.campaign_name === "string" && values.campaign_name) ||
    (typeof values.name === "string" && values.name) ||
    (values.title && typeof values.title === "object"
      ? (values.title as Record<string, string>).ru
      : "") ||
    spec.title;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="a-btn a-btn--ghost a-btn--sm px-1.5">
            <Icon name="arrowLeft" width={16} height={16} />
          </Link>
          <p className="a-eyebrow">
            {spec.title} · {isNew ? "новая запись" : "редактирование"}
          </p>
        </div>
        <h1 className="a-title">{isNew ? `${spec.title} — новая запись` : rowTitle}</h1>
      </header>

      <EntityForm
        action={action}
        fields={fields}
        values={values}
        isNew={isNew}
        from={from}
        previewKind={spec.preview ?? null}
      />

      {!isNew ? <DangerZone title={rowTitle} onDelete={del} /> : null}
    </div>
  );
}
