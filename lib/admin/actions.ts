"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { assertAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EDITABLE_TABLES, type EditableTable } from "./tables";
import { CONTENT_TAGS } from "@/lib/content/tags";

type Row = Record<string, unknown>;
type Result = { ok: true; id?: string } | { ok: false; error: string };

/** User-scoped client, loosely typed so generic `.from(table)` works.
 *  Writes are still gated by RLS `is_admin()` on the database. */
async function db(): Promise<SupabaseClient> {
  await assertAdmin();
  return (await createSupabaseServerClient()) as unknown as SupabaseClient;
}

function purge(table: EditableTable) {
  updateTag(EDITABLE_TABLES[table]);
}

/** Insert (no id) or update (id present) a content row. */
export async function saveRow(
  table: EditableTable,
  values: Row,
  opts: { redirectTo?: string } = {},
): Promise<Result> {
  const supabase = await db();
  const id = typeof values.id === "string" && values.id ? values.id : null;

  const q = id
    ? supabase.from(table).update(values).eq("id", id).select("id").single()
    : supabase.from(table).insert(values).select("id").single();

  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };

  purge(table);
  if (opts.redirectTo) redirect(opts.redirectTo);
  return { ok: true, id: (data as { id?: string } | null)?.id };
}

/** Singleton tables (settings / hero) — always id = true. */
export async function saveSingleton(
  table: "settings" | "hero",
  values: Row,
): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from(table).update(values).eq("id", true);
  if (error) return { ok: false, error: error.message };
  purge(table);
  return { ok: true };
}

export async function saveNavItem(key: string, values: Row): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("nav_items").update(values).eq("key", key);
  if (error) return { ok: false, error: error.message };
  updateTag(CONTENT_TAGS.nav);
  return { ok: true };
}

export async function saveNav(
  rows: { key: string; visible: boolean; sort_order: number; label: Row }[],
): Promise<Result> {
  const supabase = await db();
  for (const r of rows) {
    const { error } = await supabase
      .from("nav_items")
      .update({ visible: r.visible, sort_order: r.sort_order, label: r.label })
      .eq("key", r.key);
    if (error) return { ok: false, error: error.message };
  }
  updateTag(CONTENT_TAGS.nav);
  return { ok: true };
}

export async function deleteRow(
  table: EditableTable,
  id: string,
): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  purge(table);
  return { ok: true };
}

export async function setActive(
  table: EditableTable,
  id: string,
  active: boolean,
): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from(table).update({ active }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  purge(table);
  return { ok: true };
}

export async function reorder(
  table: EditableTable,
  ids: string[],
): Promise<Result> {
  const supabase = await db();
  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from(table)
      .update({ sort_order: i + 1 })
      .eq("id", ids[i]);
    if (error) return { ok: false, error: error.message };
  }
  purge(table);
  return { ok: true };
}
