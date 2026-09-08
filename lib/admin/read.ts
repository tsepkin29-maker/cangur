import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { assertAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EditableTable } from "./tables";

async function db(): Promise<SupabaseClient> {
  await assertAdmin();
  return (await createSupabaseServerClient()) as unknown as SupabaseClient;
}

export async function listRows(
  table: EditableTable,
  order: string = "sort_order",
  desc = false,
): Promise<Record<string, unknown>[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(order, { ascending: !desc });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getRow(
  table: EditableTable,
  id: string,
): Promise<Record<string, unknown> | null> {
  const supabase = await db();
  const { data } = await supabase.from(table).select("*").eq("id", id).single();
  return data ?? null;
}

export async function getSingleton(
  table: "settings" | "hero",
): Promise<Record<string, unknown>> {
  const supabase = await db();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", true)
    .single();
  if (error) throw new Error(error.message);
  return data ?? {};
}

export async function getNavRows(): Promise<Record<string, unknown>[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("nav_items")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function listCoachOptions(): Promise<
  { value: string; label: string }[]
> {
  const supabase = await db();
  const { data } = await supabase
    .from("coaches")
    .select("id, name")
    .order("sort_order");
  return [
    { value: "", label: "— без тренера —" },
    ...(data ?? []).map((c) => ({
      value: c.id as string,
      label: c.name as string,
    })),
  ];
}
