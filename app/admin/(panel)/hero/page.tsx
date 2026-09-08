import { SingletonForm } from "@/components/admin/SingletonForm";
import { HERO_FIELDS } from "@/lib/admin/specs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <SingletonForm
      table="hero"
      title="Hero"
      fields={HERO_FIELDS}
      previewKind="hero"
      description="Первый экран. Если видео выключено — показывается только постер."
      from={from ?? null}
    />
  );
}
