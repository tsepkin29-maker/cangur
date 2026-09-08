import { SingletonForm } from "@/components/admin/SingletonForm";
import { SEO_FIELDS } from "@/lib/admin/specs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <SingletonForm
      table="settings"
      title="SEO"
      fields={SEO_FIELDS}
      description="Заголовок и описание для каждого языка. Canonical, hreflang и robots система формирует сама."
      from={from ?? null}
    />
  );
}
