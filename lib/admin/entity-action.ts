"use server";

import type { FieldSpec } from "./entity";
import { rowFromFormData } from "./entity";
import type { EditableTable } from "./tables";
import { saveRow, saveSingleton } from "./actions";

export type FormState = {
  ok: boolean;
  error?: string;
  savedAt?: number;
  id?: string;
};

/**
 * Generic create/update for a content entity. No redirect on success —
 * the form shows "Сохранено" + [Посмотреть на сайте] / [Продолжить].
 * Bound per page with the table + field specs.
 */
export async function saveEntity(
  table: EditableTable,
  fields: FieldSpec[],
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const row = rowFromFormData(fields, formData);
  const res = await saveRow(table, row);
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, savedAt: Date.now(), id: res.id };
}

/** Singleton save (settings / hero) — stays on the same page. */
export async function saveSingletonEntity(
  table: "settings" | "hero",
  fields: FieldSpec[],
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const row = rowFromFormData(fields, formData);
  delete row.id;
  const res = await saveSingleton(table, row);
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, savedAt: Date.now() };
}

export async function removeEntity(
  table: EditableTable,
  id: string,
): Promise<void> {
  const { deleteRow } = await import("./actions");
  await deleteRow(table, id);
}
