import type { EditableTable } from "./tables";

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "toggle"
  | "url"
  | "date"
  | "localized"
  | "localizedMultiline"
  | "select"
  | "image";

export interface FieldSpec {
  name: string;
  kind: FieldKind;
  label: string;
  help?: string;
  optional?: boolean;
  defaultOn?: boolean; // toggle default for a new row
  numberDefault?: number; // value used for an empty "number" field (NOT NULL columns)
  options?: { value: string; label: string }[];
  folder?: string; // image upload folder
}

export type PreviewKind =
  | "pricing"
  | "hero"
  | "ad"
  | "product"
  | "program"
  | "coach"
  | "testimonial"
  | "gallery";

export interface EntitySpec {
  table: EditableTable;
  title: string;
  listPath: string;
  preview?: PreviewKind;
  /** columns shown in the list table (subset of fields, by name) */
  listColumns: { name: string; label: string; kind?: "text" | "badge" | "image" }[];
  fields: FieldSpec[];
  /** column to order the list by (default "sort_order") */
  orderBy?: string;
  orderDesc?: boolean;
  /** manual ↑/↓ ordering via sort_order (default true) */
  reorderable?: boolean;
}

const LOC = ["ru", "ro", "en"] as const;

/** Build a DB row object from submitted FormData according to the spec. */
export function rowFromFormData(
  fields: FieldSpec[],
  formData: FormData,
): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  const id = formData.get("id");
  if (typeof id === "string" && id && id !== "new") row.id = id;

  for (const f of fields) {
    switch (f.kind) {
      case "toggle":
        row[f.name] = formData.get(f.name) === "on";
        break;
      case "number": {
        const raw = String(formData.get(f.name) ?? "").trim();
        if (raw === "") {
          row[f.name] = f.numberDefault ?? null;
        } else {
          const n = Number(raw);
          row[f.name] = Number.isFinite(n) ? n : (f.numberDefault ?? null);
        }
        break;
      }
      case "localized":
      case "localizedMultiline": {
        const obj: Record<string, string> = {};
        for (const l of LOC) {
          const v = String(formData.get(`${f.name}.${l}`) ?? "").trim();
          if (v) obj[l] = v;
        }
        row[f.name] = obj;
        break;
      }
      case "date": {
        const raw = String(formData.get(f.name) ?? "").trim();
        row[f.name] = raw === "" ? null : new Date(raw).toISOString();
        break;
      }
      default: {
        const raw = String(formData.get(f.name) ?? "").trim();
        row[f.name] = raw === "" ? (f.optional ? null : "") : raw;
      }
    }
  }
  return row;
}
