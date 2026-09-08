"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FieldSpec } from "@/lib/admin/entity";
import type { FormState } from "@/lib/admin/entity-action";
import { ImageInput } from "./ImageInput";
import { SavedBanner } from "./SavedBanner";

type Values = Record<string, unknown>;
const LOCALES = [
  { key: "ru", label: "RU" },
  { key: "ro", label: "RO" },
  { key: "en", label: "EN" },
] as const;

function loc(v: unknown, k: string): string {
  return v && typeof v === "object"
    ? ((v as Record<string, string>)[k] ?? "")
    : "";
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="admin-btn admin-btn--primary" disabled={pending}>
      {pending ? "Сохранение…" : "Сохранить"}
    </button>
  );
}

export function EntityForm({
  action,
  fields,
  values,
  isNew,
  from,
  listPath,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  fields: FieldSpec[];
  values: Values;
  isNew?: boolean;
  from?: string | null;
  listPath?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {
    ok: true,
  });

  return (
    <form action={formAction} className="flex max-w-[720px] flex-col gap-5">
      {!isNew && typeof values.id === "string" ? (
        <input type="hidden" name="id" value={values.id} />
      ) : null}

      {fields.map((f) => {
        const v = values[f.name];
            if (f.kind === "image") {
          return (
            <ImageInput
              key={f.name}
              name={f.name}
              label={f.label}
              defaultValue={typeof v === "string" ? v : null}
              folder={f.folder}
              optional={f.optional}
              help={f.help}
            />
          );
        }

        if (f.kind === "toggle") {
          const on =
            v === undefined || v === null ? (f.defaultOn ?? false) : v === true;
          return (
            <label key={f.name} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                name={f.name}
                defaultChecked={on}
                className="h-4 w-4 accent-[var(--a-accent)]"
              />
              <span className="text-[13px] font-bold">{f.label}</span>
            </label>
          );
        }

        if (f.kind === "select") {
          return (
            <label key={f.name} className="flex flex-col gap-1.5">
              <span className="text-[13px] font-bold">{f.label}</span>
              <select
                name={f.name}
                defaultValue={typeof v === "string" ? v : (f.options?.[0]?.value ?? "")}
                className="admin-select"
              >
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        if (f.kind === "localized" || f.kind === "localizedMultiline") {
          const Multi = f.kind === "localizedMultiline";
          return (
            <fieldset key={f.name} className="flex flex-col gap-1.5">
              <legend className="text-[13px] font-bold">{f.label}</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {LOCALES.map((l) => (
                  <label key={l.key} className="flex flex-col gap-1">
                    <span className="text-[11px] text-[var(--a-muted)]">
                      {l.label}
                    </span>
                    {Multi ? (
                      <textarea
                        name={`${f.name}.${l.key}`}
                        defaultValue={loc(v, l.key)}
                        className="admin-textarea"
                      />
                    ) : (
                      <input
                        name={`${f.name}.${l.key}`}
                        defaultValue={loc(v, l.key)}
                        className="admin-input"
                      />
                    )}
                  </label>
                ))}
              </div>
              {f.help ? (
                <span className="text-[12px] text-[var(--a-muted)]">
                  {f.help}
                </span>
              ) : null}
            </fieldset>
          );
        }

        // text | textarea | number | url | date
        return (
          <label key={f.name} className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold">{f.label}</span>
            {f.kind === "textarea" ? (
              <textarea
                name={f.name}
                defaultValue={typeof v === "string" ? v : ""}
                className="admin-textarea"
              />
            ) : (
              <input
                name={f.name}
                type={
                  f.kind === "number"
                    ? "number"
                    : f.kind === "url"
                      ? "url"
                      : f.kind === "date"
                        ? "date"
                        : "text"
                }
                step={f.kind === "number" ? "any" : undefined}
                defaultValue={
                  v === null || v === undefined ? "" : String(v)
                }
                className="admin-input"
              />
            )}
            {f.help ? (
              <span className="text-[12px] text-[var(--a-muted)]">{f.help}</span>
            ) : null}
          </label>
        );
      })}

      {state.error ? (
        <p className="text-[13px] text-[#ff6b81]">Ошибка: {state.error}</p>
      ) : null}

      <SavedBanner from={from} listPath={listPath} savedAt={state.savedAt} />

      <SubmitBtn />
    </form>
  );
}
