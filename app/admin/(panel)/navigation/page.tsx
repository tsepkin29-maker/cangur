import { getNavRows } from "@/lib/admin/read";
import { NavigationForm } from "@/components/admin/NavigationForm";

export default async function Page() {
  const rows = await getNavRows();
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-black">Навигация</h1>
      <NavigationForm
        rows={rows.map((r) => ({
          key: String(r.key),
          visible: r.visible !== false,
          sort_order: Number(r.sort_order ?? 0),
          label:
            r.label && typeof r.label === "object"
              ? (r.label as Record<string, string>)
              : {},
        }))}
      />
    </div>
  );
}
