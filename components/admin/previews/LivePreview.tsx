"use client";

/**
 * Lightweight visual previews that mimic the public site cards, fed by the
 * live form values. Presentation only — no data fetching, no shared logic
 * with the real components (kept deliberately simple).
 */

type V = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : "");
const loc = (v: unknown, k = "ru") =>
  v && typeof v === "object" ? s((v as Record<string, string>)[k]) : "";

export type PreviewKind =
  | "pricing"
  | "hero"
  | "ad"
  | "product"
  | "program"
  | "coach"
  | "testimonial"
  | "gallery";

export function LivePreview({
  kind,
  values,
  locale = "ru",
}: {
  kind: PreviewKind;
  values: V;
  locale?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--line-2)] bg-[#0b0b0d] p-4">
      <p className="a-eyebrow mb-3">Предпросмотр</p>
      <div className="[color-scheme:dark]">{render(kind, values, locale)}</div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0a0a0a] text-white">
      {children}
    </div>
  );
}

function render(kind: PreviewKind, v: V, l: string) {
  switch (kind) {
    case "pricing": {
      const badge = loc(v.badge, l);
      const per =
        { month: "в месяц", session: "за занятие", package: "пакет" }[
          s(v.period)
        ] ?? loc(v.period_label, l);
      return (
        <Shell>
          <div className="bg-[linear-gradient(145deg,#161616,#101010)] p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[13px] font-extrabold text-[#b8b8bd]">
                {loc(v.title, l) || "Название тарифа"}
              </span>
              {badge ? (
                <span className="rounded-full border border-[#ed1b3f]/40 bg-[#ed1b3f]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#ff7890]">
                  {badge}
                </span>
              ) : null}
            </div>
            {loc(v.description, l) ? (
              <p className="mt-2 text-[13px] text-[#8a8a8a]">
                {loc(v.description, l)}
              </p>
            ) : null}
            <div className="mt-6 flex items-baseline gap-2">
              <strong className="text-2xl font-black tracking-tight">
                {s(v.price) || "0"} {s(v.currency) || "MDL"}
              </strong>
              {s(v.old_price) ? (
                <s className="text-sm text-[#8a8a8a]">
                  {s(v.old_price)} {s(v.currency) || "MDL"}
                </s>
              ) : null}
            </div>
            {per ? (
              <div className="mt-1 text-[13px] text-[#8a8a8a]">{per}</div>
            ) : null}
          </div>
        </Shell>
      );
    }

    case "hero":
      return (
        <Shell>
          <div
            className="relative min-h-[220px] bg-cover bg-center p-6"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(8,8,8,.35),rgba(6,6,6,.82)), url(${s(v.poster_url) || "/video/hero-poster.jpg"})`,
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#ff7890]">
              {loc(v.kicker, l) || "CANGUR BOXING CLUB"}
            </p>
            <p className="mt-2 font-[var(--font-onest)] text-[2rem] font-black uppercase leading-[0.85] tracking-tight">
              {loc(v.headline, l) || "READY TO FIGHT?"}
            </p>
            <p className="mt-2 text-sm font-black uppercase tracking-wide text-[#b9b9be]">
              {loc(v.subtitle, l)}
            </p>
            {v.cta_enabled !== false && loc(v.cta_label, l) ? (
              <span className="mt-3 inline-flex rounded-lg bg-[#ed1b3f] px-4 py-2 text-[13px] font-black">
                {loc(v.cta_label, l)}
              </span>
            ) : null}
          </div>
        </Shell>
      );

    case "ad": {
      const label =
        s(v.label_type) === "advertisement" ? "Реклама" : "Партнёр";
      const img = s(v.desktop_image_url) || s(v.mobile_image_url);
      return (
        <Shell>
          <div className="grid sm:grid-cols-[40%_1fr]">
            <div className="relative aspect-[16/10] w-full bg-[#111]">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-[11px] text-white/40">
                  изображение
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                {label}
              </span>
            </div>
            <div className="flex flex-col justify-center gap-1.5 p-5">
              {s(v.sponsor_name) ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7890]">
                  {s(v.sponsor_name)}
                </span>
              ) : null}
              <p className="font-[var(--font-onest)] text-lg font-black uppercase leading-tight">
                {loc(v.title, l) || "Заголовок кампании"}
              </p>
              {loc(v.subtitle, l) ? (
                <p className="text-[13px] text-[#a1a1aa]">{loc(v.subtitle, l)}</p>
              ) : null}
              {loc(v.cta_label, l) ? (
                <span className="mt-1.5 inline-flex w-max rounded-lg bg-[#ed1b3f] px-3.5 py-2 text-[13px] font-black">
                  {loc(v.cta_label, l)} →
                </span>
              ) : null}
            </div>
          </div>
        </Shell>
      );
    }

    case "product":
      return (
        <Shell>
          {s(v.image_url) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s(v.image_url)}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="grid aspect-square place-items-center bg-[#111] text-[11px] text-white/40">
              фото
            </div>
          )}
          <div className="p-4">
            <p className="text-lg font-black">{loc(v.title, l) || "Товар"}</p>
            <p className="mt-1 text-[13px] text-[#8a8a8a]">{loc(v.spec, l)}</p>
            <p className="mt-3 text-xl font-black">
              {s(v.price) || "0"} {s(v.currency) || "MDL"}
            </p>
          </div>
        </Shell>
      );

    case "program":
      return (
        <Shell>
          <div className="relative aspect-[3/4] w-full">
            {s(v.image_url) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s(v.image_url)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center bg-[#111] text-[11px] text-white/40">
                фото
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-4">
              <p className="font-[var(--font-onest)] text-lg font-black">
                {loc(v.title, l) || "Направление"}
              </p>
              <p className="mt-1 text-[12px] text-[#bbb]">{loc(v.description, l)}</p>
            </div>
          </div>
        </Shell>
      );

    case "coach":
      return (
        <Shell>
          {s(v.photo_url) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s(v.photo_url)}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ) : null}
          <div className="p-4">
            <p className="text-lg font-black">{s(v.name) || "Имя"}</p>
            <p className="mt-1 text-[12px] font-black uppercase tracking-wide text-[#ff7890]">
              {loc(v.role, l)}
              {s(v.experience) ? ` · ${s(v.experience)}` : ""}
            </p>
            {loc(v.bio, l) ? (
              <p className="mt-2 text-[13px] text-[#a1a1aa]">{loc(v.bio, l)}</p>
            ) : null}
          </div>
        </Shell>
      );

    case "testimonial":
      return (
        <Shell>
          <div className="p-5">
            <p className="text-[#ccc]">{loc(v.body, l) || "Текст отзыва…"}</p>
            <p className="mt-3 font-black">— {s(v.author) || "Автор"}</p>
          </div>
        </Shell>
      );

    case "gallery":
      return (
        <Shell>
          {s(v.image_url) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s(v.image_url)}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="grid aspect-[4/3] place-items-center bg-[#111] text-[11px] text-white/40">
              фото
            </div>
          )}
          {loc(v.caption, l) ? (
            <p className="p-3 text-[13px] font-bold">{loc(v.caption, l)}</p>
          ) : null}
        </Shell>
      );

    default:
      return null;
  }
}
