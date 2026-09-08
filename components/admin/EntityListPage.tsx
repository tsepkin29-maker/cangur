import { listRows } from "@/lib/admin/read";
import type { EntitySpec } from "@/lib/admin/entity";
import { ResourceTable, type RowView } from "./ResourceTable";

function localizedFirst(v: unknown): string {
  if (v && typeof v === "object") {
    const o = v as Record<string, string>;
    return o.ru || o.ro || o.en || "";
  }
  return typeof v === "string" ? v : "";
}

export async function EntityListPage({
  spec,
  from,
}: {
  spec: EntitySpec;
  from?: string | null;
}) {
  const rows = await listRows(
    spec.table,
    spec.orderBy ?? "sort_order",
    spec.orderDesc ?? false,
  );

  const titleField = spec.listColumns[0]?.name ?? "title";
  const imageField = spec.fields.find((f) => f.kind === "image")?.name;

  const views: RowView[] = rows.map((r) => ({
    id: String(r.id),
    title:
      localizedFirst(r[titleField]) ||
      String(r.campaign_name ?? r.slug ?? ""),
    subtitle:
      typeof r.price === "number" || typeof r.price === "string"
        ? `${r.price} ${r.currency ?? ""}`.trim()
        : localizedFirst(r.spec) || undefined,
    image: imageField ? ((r[imageField] as string) || null) : null,
    active: r.active !== false,
  }));

  const q = from ? `?from=${encodeURIComponent(from)}` : "";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-black">{spec.title}</h1>
        {from ? (
          <a href={from} className="admin-btn">
            ← Вернуться на сайт
          </a>
        ) : null}
      </div>
      <ResourceTable
        table={spec.table}
        basePath={spec.listPath}
        rows={views}
        addLabel={spec.title}
        reorderable={spec.reorderable ?? true}
        linkQuery={q}
      />
    </div>
  );
}
