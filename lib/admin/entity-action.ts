"use server";

import { revalidatePath } from "next/cache";
import type { FieldSpec } from "./entity";
import { rowFromFormData } from "./entity";
import type { EditableTable } from "./tables";
import { saveRow, deleteRow as deleteRowAction } from "./actions";

export type FormState = { ok: boolean; error?: string; savedAt?: number };

/**
 * Generic create/update for a content entity. Bound per page with the
 * table, its field specs and where to go after a successful save.
 */
export async function saveEntity(
  table: EditableTable,
  fields: FieldSpec[],
  redirectTo: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const row = rowFromFormData(fields, formData);
  const res = await saveRow(table, row, { redirectTo });
  if (!res.ok) return { ok: false, error: res.error };
  revalidatePath(redirectTo);
  return { ok: true, savedAt: Date.now() };
}

/** Singleton save (settings/hero) — stays on the same page. */
export async function saveSingletonEntity(
  table: "settings" | "hero",
  fields: FieldSpec[],
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { saveSingleton } = await import("./actions");
  const row = rowFromFormData(fields, formData);
  delete row.id;
  const res = await saveSingleton(table, row);
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, savedAt: Date.now() };
}

export async function removeEntity(
  table: EditableTable,
  id: string,
  redirectTo: string,
): Promise<void> {
  await deleteRowAction(table, id);
  revalidatePath(redirectTo);
}
