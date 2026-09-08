import { SingletonForm } from "@/components/admin/SingletonForm";
import { HERO_FIELDS } from "@/lib/admin/specs";

export default function Page() {
  return (
    <SingletonForm
      table="hero"
      title="Hero"
      fields={HERO_FIELDS}
      description="Первый экран. Если видео выключено — показывается только постер."
    />
  );
}
