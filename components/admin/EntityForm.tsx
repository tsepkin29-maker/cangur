"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FieldSpec } from "@/lib/admin/entity";
import type { FormState } from "@/lib/admin/entity-action";
import { ImageInput } from "./ImageInput";
import { LivePreview, type PreviewKind } from "./previews/LivePreview";
import { Icon } from "./icons";

type Values = Record<string, unknown>;
const LOCALES = [
  { key: "ru", label: "RU" },
  { key: "ro", label: "RO" },
  { key: "en", label: "EN" },
] as const;
const LOC_KINDS = new Set(["localized", "localizedMultiline"]);

function SaveBar({
  dirty,
  savedAt,
  from,
}: {
  dirty: boolean;
  savedAt?: number;
  from?: string | null;
}) {
  const { pending } = useFormStatus();
  if (!dirty && !savedAt && !pending) return null;
  return (
    <div className="sticky bottom-0 z-20 -mx-1 mt-2 flex flex-wrap items-center gap-3 rounded-[12px] border border-[var(--line-2)] bg-[rgba(18,18,20,0.92)] px-4 py-3 backdrop-blur">
      {savedAt && !dirty ? (
        <span className="a-row font-bold text-[var(--ok)]" style={{ gap: 7 }}>
          <Icon name="check" width={15} height={15} /> Сохранено
        </span>
      ) : (
        <span className="a-meta">Есть несохранённые изменения</span>
      )}
      {savedAt && !dirty && from ? (
        <a href={from} className="a-btn a-btn--sm">
          Посмотреть на сайте <Icon name="external" width={13} height={13} />
        </a>
      ) : null}
      <button
        className="a-btn a-btn--sm a-btn--primary ml-auto"
        disabled={pending}
      >
        {pending ? "Сохранение…" : "Сохранить"}
      </button>
    </div>
  );
}

export function EntityForm({
  action,
  fields,
  values,
  isNew,
  from,
  previewKind,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  fields: FieldSpec[];
  values: Values;
  isNew?: boolean;
  from?: string | null;
  previewKind?: PreviewKind | null;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {
    ok: true,
  });
  const [tab, setTab] = useState<"ru" | "ro" | "en">("ru");

  const initial = useMemo(() => normalise(fields, values), [fields, values]);
  const [vals, setVals] = useState<Values>(initial);
  const dirty = JSON.stringify(vals) !== JSON.stringify(initial);

  const set = (name: string, v: unknown) =>
    setVals((s) => ({ ...s, [name]: v }));
  const setLoc = (name: string, loc: string, v: string) =>
    setVals((s) => ({
      ...s,
      [name]: { ...(s[name] as Record<string, string>), [loc]: v },
    }));

  const localized = fields.filter((f) => LOC_KINDS.has(f.kind));
  const globals = fields.filter((f) => !LOC_KINDS.has(f.kind));

  const form = (
    <form action={formAction} className="flex flex-col gap-6">
      {!isNew && typeof values.id === "string" ? (
        <input type="hidden" name="id" value={values.id} />
      ) : null}

      {/* localized block with RU/RO/EN tabs */}
      {localized.length ? (
        <section className="a-card a-card--pad flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            {LOCALES.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setTab(l.key)}
                className={`a-btn a-btn--sm ${tab === l.key ? "a-btn--primary" : "a-btn--ghost"}`}
              >
                {l.label}
              </button>
            ))}
            <span className="ml-auto text-[12px] a-faint">
              переводимые поля
            </span>
          </div>

          {localized.map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <span className="text-[13px] font-bold">{f.label}</span>
              {LOCALES.map((l) =>
                l.key === tab ? (
                  f.kind === "localizedMultiline" ? (
                    <textarea
                      key={l.key}
                      name={`${f.name}.${l.key}`}
                      className="a-textarea"
                      value={locVal(vals[f.name], l.key)}
                      onChange={(e) => setLoc(f.name, l.key, e.target.value)}
                    />
                  ) : (
                    <input
                      key={l.key}
                      name={`${f.name}.${l.key}`}
                      className="a-input"
                      value={locVal(vals[f.name], l.key)}
                      onChange={(e) => setLoc(f.name, l.key, e.target.value)}
                    />
                  )
                ) : (
                  <input
                    key={l.key}
                    type="hidden"
                    name={`${f.name}.${l.key}`}
                    value={locVal(vals[f.name], l.key)}
                  />
                ),
              )}
              {f.help ? (
                <span className="text-[12px] a-faint">{f.help}</span>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {globals.length ? (
        <section className="a-card a-card--pad flex flex-col gap-4">
          <span className="text-[12px] a-faint">Общие настройки</span>
          {globals.map((f) => (
            <GlobalField
              key={f.name}
              f={f}
              value={vals[f.name]}
              onText={(v) => set(f.name, v)}
              onBool={(v) => set(f.name, v)}
            />
          ))}
        </section>
      ) : null}

      {state.error ? (
        <p className="text-[13px] text-[var(--red-soft)]">
          Ошибка: {state.error}
        </p>
      ) : null}

      <SaveBar dirty={dirty} savedAt={state.savedAt} from={from} />
    </form>
  );

  if (!previewKind) return form;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {form}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <LivePreview kind={previewKind} values={vals} locale={tab} />
      </aside>
    </div>
  );
}

/* ---------- helpers ---------- */

function normalise(fields: FieldSpec[], values: Values): Values {
  const out: Values = { ...values };
  for (const f of fields) {
    if (LOC_KINDS.has(f.kind)) {
      const cur = (values[f.name] ?? {}) as Record<string, string>;
      out[f.name] = { ru: cur.ru ?? "", ro: cur.ro ?? "", en: cur.en ?? "" };
    } else if (f.kind === "toggle") {
      out[f.name] =
        values[f.name] === undefined || values[f.name] === null
          ? (f.defaultOn ?? false)
          : values[f.name] === true;
    } else if (f.kind === "select") {
      out[f.name] =
        (values[f.name] as string) ?? f.options?.[0]?.value ?? "";
    } else {
      const v = values[f.name];
      out[f.name] = v === null || v === undefined ? "" : String(v);
    }
  }
  return out;
}

function locVal(v: unknown, k: string): string {
  return v && typeof v === "object"
    ? ((v as Record<string, string>)[k] ?? "")
    : "";
}

function GlobalField({
  f,
  value,
  onText,
  onBool,
}: {
  f: FieldSpec;
  value: unknown;
  onText: (v: string) => void;
  onBool: (v: boolean) => void;
}) {
  if (f.kind === "image") {
    return (
      <ImageInput
        name={f.name}
        label={f.label}
        value={typeof value === "string" ? value : ""}
        onChange={onText}
        folder={f.folder}
        optional={f.optional}
        help={f.help}
      />
    );
  }
  if (f.kind === "toggle") {
    return (
      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          name={f.name}
          checked={value === true}
          onChange={(e) => onBool(e.target.checked)}
          className="h-4 w-4 accent-[var(--red)]"
        />
        <span className="text-[13px] font-bold">{f.label}</span>
      </label>
    );
  }
  if (f.kind === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold">{f.label}</span>
        <select
          name={f.name}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onText(e.target.value)}
          className="a-select"
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
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold">{f.label}</span>
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
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onText(e.target.value)}
        className="a-input"
      />
      {f.help ? <span className="text-[12px] a-faint">{f.help}</span> : null}
    </label>
  );
}
