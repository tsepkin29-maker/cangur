import Link from "next/link";
import Image from "next/image";
import { getSingleton, listRows } from "@/lib/admin/read";
import { Icon } from "@/components/admin/icons";

function locFirst(v: unknown): string {
  if (v && typeof v === "object") {
    const o = v as Record<string, string>;
    return o.ru || o.ro || o.en || "";
  }
  return typeof v === "string" ? v : "";
}

type Row = Record<string, unknown>;

function pickLiveAd(ads: Row[]): Row | undefined {
  const now = Date.now();
  return ads.find(
    (a) =>
      a.active !== false &&
      (!a.start_date || Date.parse(a.start_date as string) <= now) &&
      (!a.end_date || Date.parse(a.end_date as string) >= now),
  );
}

function pickLastChange(times: unknown[]): string | undefined {
  return (times.filter(Boolean) as string[]).sort().pop();
}

function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export default async function Dashboard() {
  const [
    hero,
    settings,
    pricing,
    schedule,
    ads,
    programs,
    gallery,
    coaches,
    products,
    testimonials,
  ] = await Promise.all([
    getSingleton("hero"),
    getSingleton("settings"),
    listRows("pricing_plans"),
    listRows("schedule_slots"),
    listRows("advertisements", "priority", true),
    listRows("programs"),
    listRows("gallery_images"),
    listRows("coaches"),
    listRows("products"),
    listRows("testimonials"),
  ]);

  const liveAd = pickLiveAd(ads);
  const lastChange = pickLastChange([
    settings.updated_at,
    hero.updated_at,
    ...pricing.map((p) => p.updated_at),
    ...programs.map((p) => p.updated_at),
    ...ads.map((a) => a.updated_at),
  ]);

  const heroImg = (hero.poster_url as string) || "/video/hero-poster.jpg";
  const activePrograms = programs.filter((p) => p.active !== false).length;

  return (
    <div className="flex flex-col gap-10">
      {/* hero of the dashboard */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="a-eyebrow">CANGUR CONTROL</p>
          <h1 className="a-title mt-2">Управление сайтом</h1>
          <p className="a-meta mt-2">
            Контент, расписание, цены и реклама Cangur.
          </p>
        </div>
        <a
          href="/ru"
          target="_blank"
          rel="noopener noreferrer"
          className="a-btn a-btn--sm"
        >
          Открыть сайт <Icon name="external" width={14} height={14} />
        </a>
      </header>

      {/* status strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] a-faint">
        <span className="a-row" style={{ gap: 8 }}>
          <span className="a-dot" />
          <span className="text-[var(--text-dim)]">Сайт работает</span>
        </span>
        <span>RU · RO · EN</span>
        <span>Последнее изменение: {fmtDate(lastChange)}</span>
      </div>

      {/* quick management */}
      <section className="flex flex-col gap-4">
        <p className="a-h2">Быстрое управление</p>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* hero preview */}
          <Link
            href="/admin/hero"
            className="a-card a-card--hover group relative overflow-hidden"
          >
            <div className="relative aspect-[16/8] w-full">
              <Image
                src={heroImg}
                alt=""
                fill
                sizes="700px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div>
                  <p className="a-eyebrow">Главный экран</p>
                  <p className="mt-1 text-lg font-bold">
                    {locFirst(hero.headline) || "Hero"}
                  </p>
                  <p className="a-meta mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`a-dot ${hero.video_enabled === false ? "a-dot--off" : ""}`}
                    />
                    {hero.video_enabled === false ? "Только фото" : "Видео активно"}
                  </p>
                </div>
                <span className="a-btn a-btn--sm a-btn--primary">
                  Редактировать <Icon name="arrowLeft" width={14} height={14} style={{ transform: "rotate(180deg)" }} />
                </span>
              </div>
            </div>
          </Link>

          {/* quick actions */}
          <div className="flex flex-col gap-3">
            <QuickAction
              href="/admin/pricing"
              title="Цены"
              value={`${pricing.length} ${plural(pricing.length, "тариф", "тарифа", "тарифов")}`}
              cta="Изменить"
              icon="prices"
            />
            <QuickAction
              href="/admin/schedule"
              title="Расписание"
              value={`${schedule.length} ${plural(schedule.length, "тренировка", "тренировки", "тренировок")}`}
              cta="Изменить"
              icon="schedule"
            />
            <QuickAction
              href="/admin/advertising"
              title="Реклама"
              value={liveAd ? String(liveAd.campaign_name) : "Нет активной кампании"}
              cta={liveAd ? "Открыть" : "Создать"}
              icon="ads"
              accent={!liveAd}
            />
          </div>
        </div>
      </section>

      {/* content overview */}
      <section className="flex flex-col gap-4">
        <p className="a-h2">Контент</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ContentCard
            href="/admin/programs"
            title="Направления"
            count={activePrograms}
            emptyLabel="Пока не добавлены"
            addLabel="+ Добавить направление"
            images={programs.slice(0, 3).map((p) => p.image_url as string)}
          />
          <ContentCard
            href="/admin/gallery"
            title="Галерея"
            count={gallery.length}
            emptyLabel="Пусто"
            addLabel="+ Добавить фото"
            images={gallery.slice(0, 4).map((g) => g.image_url as string)}
          />
          <ContentCard
            href="/admin/coaches"
            title="Тренеры"
            count={coaches.length}
            emptyLabel="Пока не добавлены"
            addLabel="+ Добавить тренера"
            images={coaches.slice(0, 4).map((c) => c.photo_url as string)}
            round
          />
          <ContentCard
            href="/admin/shop"
            title="Pro Shop"
            count={products.length}
            emptyLabel="Пусто"
            addLabel="+ Добавить товар"
            images={products.slice(0, 3).map((p) => p.image_url as string)}
          />
          <ContentCard
            href="/admin/testimonials"
            title="Отзывы"
            count={testimonials.length}
            emptyLabel="Пока нет"
            addLabel="+ Добавить отзыв"
            images={[]}
          />
        </div>
      </section>

      {/* advertising */}
      <section className="flex flex-col gap-4">
        <p className="a-h2">Реклама</p>
        {liveAd ? (
          <div className="a-card a-card--pad flex flex-wrap items-center gap-4">
            <div className="relative h-16 w-28 shrink-0">
              <Image
                src={(liveAd.desktop_image_url as string) || "/brand/og-image.jpg"}
                alt=""
                fill
                sizes="112px"
                className="a-thumb"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="a-card-title">
                {String(liveAd.sponsor_name || liveAd.campaign_name)}
              </p>
              <p className="a-meta">
                {locFirst(liveAd.title)} · {placementLabel(String(liveAd.placement))}
              </p>
              <p className="a-meta a-faint">
                {liveAd.end_date
                  ? `Показ до ${fmtDate(liveAd.end_date as string)}`
                  : "Показывается без ограничения по дате"}
              </p>
            </div>
            <Link href={`/admin/advertising/${liveAd.id}`} className="a-btn a-btn--sm">
              Редактировать
            </Link>
          </div>
        ) : (
          <div className="a-card a-card--pad flex flex-wrap items-center justify-between gap-4">
            <p className="a-meta">
              Сейчас реклама на сайте не показывается.
            </p>
            <Link href="/admin/advertising/new" className="a-btn a-btn--sm a-btn--primary">
              <Icon name="plus" width={14} height={14} /> Создать рекламную кампанию
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- small pieces ---------- */

function QuickAction({
  href,
  title,
  value,
  cta,
  icon,
  accent,
}: {
  href: string;
  title: string;
  value: string;
  cta: string;
  icon: "prices" | "schedule" | "ads";
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="a-card a-card--hover flex items-center gap-3.5 p-4"
    >
      <span
        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[var(--line-2)] text-[var(--text-dim)]"
      >
        <Icon name={icon} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="a-card-title">{title}</p>
        <p className="a-meta truncate">{value}</p>
      </div>
      <span
        className={`text-[12.5px] font-bold ${accent ? "text-[var(--red-soft)]" : "a-faint"}`}
      >
        {cta} →
      </span>
    </Link>
  );
}

function ContentCard({
  href,
  title,
  count,
  emptyLabel,
  addLabel,
  images,
  round,
}: {
  href: string;
  title: string;
  count: number;
  emptyLabel: string;
  addLabel: string;
  images: (string | null)[];
  round?: boolean;
}) {
  const pics = images.filter(Boolean) as string[];
  return (
    <Link href={href} className="a-card a-card--hover a-card--pad flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="a-card-title">{title}</p>
        <span className="a-meta a-faint">{count > 0 ? count : ""}</span>
      </div>
      {count === 0 ? (
        <div className="flex flex-col gap-1.5">
          <p className="a-meta a-faint">{emptyLabel}</p>
          <span className="text-[12.5px] font-bold text-[var(--red-soft)]">
            {addLabel}
          </span>
        </div>
      ) : (
        <div className="flex gap-2">
          {pics.slice(0, 4).map((src, i) => (
            <div
              key={i}
              className={`relative h-12 w-12 shrink-0 ${round ? "rounded-full overflow-hidden border border-[var(--line)]" : ""}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="48px"
                className={round ? "object-cover" : "a-thumb"}
              />
            </div>
          ))}
          {pics.length === 0 ? (
            <p className="a-meta a-faint self-center">Открыть →</p>
          ) : null}
        </div>
      )}
    </Link>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

function placementLabel(p: string) {
  return (
    {
      after_hero: "После Hero",
      after_programs: "После направлений",
      after_gallery: "После галереи",
      after_pricing: "После цен",
      after_schedule: "После расписания",
      before_contacts: "Перед контактами",
      footer: "В подвале",
    }[p] || p
  );
}
