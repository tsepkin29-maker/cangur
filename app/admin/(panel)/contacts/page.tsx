import { SingletonForm } from "@/components/admin/SingletonForm";
import { CONTACTS_FIELDS } from "@/lib/admin/specs";

export default function Page() {
  return (
    <SingletonForm
      table="settings"
      title="Контакты"
      fields={CONTACTS_FIELDS}
      description="Пустое поле — соответствующая строка/кнопка на сайте не показывается."
    />
  );
}
