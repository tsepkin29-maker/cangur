import { SingletonForm } from "@/components/admin/SingletonForm";
import { SETTINGS_GENERAL_FIELDS } from "@/lib/admin/specs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <SingletonForm
      table="settings"
      title="Общие настройки"
      fields={SETTINGS_GENERAL_FIELDS}
      description="Название клуба, валюта, логотип, тексты основных кнопок."
      from={from ?? null}
    />
  );
}
