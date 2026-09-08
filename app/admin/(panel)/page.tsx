import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";

const CARDS: { href: string; label: string; table?: string }[] = [
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/programs", label: "Направления", table: "programs" },
  { href: "/admin/gallery", label: "Галерея", table: "gallery_images" },
  { href: "/admin/pricing", label: "Цены", table: "pricing_plans" },
  { href: "/admin/schedule", label: "Расписание", table: "schedule_slots" },
  { href: "/admin/coaches", label: "Тренеры", table: "coaches" },
  { href: "/admin/testimonials", label: "Отзывы", table: "testimonials" },
  { href: "/admin/shop", label: "Pro Shop", table: "products" },
  { href: "/admin/advertising", label: "Реклама", table: "advertisements" },
  { href: "/admin/contacts", label: "Контакты" },
  { href: "/admin/settings", label: "Общие настройки" },
  { href: "/admin/seo", label: "SEO" },
];

export default async function Dashboard() {
  await assertAdmin();
  const supabase = await createSupabaseServerClient();

  const counts: Record<string, number> = {};
  await Promise.all(
    CARDS.filter((c) => c.table).map(async (c) => {
      const { count } = await supabase
        .from(c.table as never)
        .select("*", { count: "exact", head: true });
      counts[c.table as string] = count ?? 0;
    }),
  );

  let events = 0;
  try {
    const { count } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true });
    events = count ?? 0;
  } catch {
    /* ignore */
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-black">Дашборд</h1>
      <p className="text-[13px] text-[var(--a-muted)]">
        Изменения сохраняются в базу и появляются на сайте сразу — без
        перевыкладки.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="admin-card flex flex-col gap-1 p-4 hover:border-[#3a3a44]"
          >
            <span className="font-bold">{c.label}</span>
            {c.table ? (
              <span className="text-[13px] text-[var(--a-muted)]">
                {counts[c.table] ?? 0} записей
              </span>
            ) : (
              <span className="text-[13px] text-[var(--a-muted)]">настройка</span>
            )}
          </Link>
        ))}
      </div>

      <div className="admin-card p-4">
        <p className="text-[13px] text-[var(--a-muted)]">Событий аналитики собрано</p>
        <p className="text-2xl font-black">{events}</p>
      </div>
    </div>
  );
}
