import { SingletonForm } from "@/components/admin/SingletonForm";
import { SETTINGS_GENERAL_FIELDS } from "@/lib/admin/specs";

export default function Page() {
  return (
    <SingletonForm
      table="settings"
      title="Общие настройки"
      fields={SETTINGS_GENERAL_FIELDS}
      description="Название клуба, валюта, логотип, тексты основных кнопок."
    />
  );
}
