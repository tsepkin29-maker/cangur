import { listRows } from "@/lib/admin/read";
import type { EntitySpec } from "@/lib/admin/entity";
import { ResourceTable, type RowView } from "./ResourceTable";
import { Icon } from "./icons";

function localizedFirst(v: unknown): string {
  if (v && typeof v === "object") {
    const o = v as Record<string, string>;
    return o.ru || o.ro || o.en || "";
  }
  return typeof v === "string" ? v : "";
}
function filledLocales(...fields: unknown[]): string[] {
  const set = new Set<string>();
  for (const f of fields) {
    if (f && typeof f === "object") {
      for (const [k, val] of Object.entries(f as Record<string, string>)) {
        if (val && String(val).trim()) set.add(k.toUpperCase());
      }
    }
  }
  return ["RU", "RO", "EN"].filter((l) => set.has(l));
}

const PERIOD: Record<string, string> = {
  month: "мес",
  session: "занятие",
  package: "пакет",
  custom: "",
};

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
  const locFields = spec.fields
    .filter((f) => f.kind === "localized" || f.kind === "localizedMultiline")
    .map((f) => f.name);

  const views: RowView[] = rows.map((r) => {
    let subtitle: string | undefined;
    if (r.price != null && r.price !== "") {
      const per = PERIOD[String(r.period ?? "")] ?? "";
      subtitle = `${r.price} ${r.currency ?? "MDL"}${per ? ` / ${per}` : ""}`;
    } else if (r.day_of_week != null) {
      subtitle =
        r.by_arrangement ? "по договорённости" : String(r.time_label || "");
    } else if (r.placement) {
      subtitle = String(r.sponsor_name || r.placement);
    } else if (r.spec) {
      subtitle = localizedFirst(r.spec);
    } else if (r.role) {
      subtitle = localizedFirst(r.role);
    }

    return {
      id: String(r.id),
      title:
        localizedFirst(r[titleField]) ||
        String(r.campaign_name ?? r.name ?? r.author ?? r.slug ?? ""),
      subtitle,
      locales: filledLocales(...locFields.map((n) => r[n])),
      image: imageField ? ((r[imageField] as string) || null) : null,
      active: r.active !== false,
    };
  });

  const q = from ? `?from=${encodeURIComponent(from)}` : "";
  const n = views.length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="a-eyebrow">CANGUR CONTROL</p>
          <h1 className="a-title mt-1.5">{spec.title}</h1>
          <p className="a-meta mt-1.5">
            {n} {n === 1 ? "запись" : "записей"}
            {from ? (
              <>
                {" · "}
                <a href={from} className="hover:text-[var(--text)]">
                  ← вернуться на сайт
                </a>
              </>
            ) : null}
          </p>
        </div>
        <a
          href={`${spec.listPath}/new${q}`}
          className="a-btn a-btn--sm a-btn--primary"
        >
          <Icon name="plus" width={14} height={14} /> Добавить
        </a>
      </header>

      <ResourceTable
        table={spec.table}
        basePath={spec.listPath}
        rows={views}
        reorderable={spec.reorderable ?? true}
        linkQuery={q}
      />
    </div>
  );
}
