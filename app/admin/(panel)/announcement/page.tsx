import { SingletonForm } from "@/components/admin/SingletonForm";
import { ANNOUNCEMENT_FIELDS } from "@/lib/admin/specs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <SingletonForm
      table="settings"
      title="Объявление"
      fields={ANNOUNCEMENT_FIELDS}
      description="Тонкая плашка над шапкой сайта. Выключите тумблер — плашка исчезнет."
      from={from ?? null}
    />
  );
}
