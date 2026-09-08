import type { EntitySpec, FieldSpec } from "./entity";

const active: FieldSpec = {
  name: "active",
  kind: "toggle",
  label: "Показывать на сайте",
  defaultOn: true,
};
const slug = (help: string): FieldSpec => ({
  name: "slug",
  kind: "text",
  label: "Идентификатор (slug)",
  help,
});
const currency: FieldSpec = {
  name: "currency",
  kind: "text",
  label: "Валюта",
  help: "например MDL",
};

export const PROGRAMS_SPEC: EntitySpec = {
  table: "programs",
  title: "Направление",
  listPath: "/admin/programs",
  preview: "program",
  listColumns: [{ name: "title", label: "Название" }],
  fields: [
    slug("латиницей, без пробелов — напр. sparring"),
    { name: "title", kind: "localized", label: "Название" },
    { name: "description", kind: "localizedMultiline", label: "Описание" },
    { name: "image_url", kind: "image", label: "Фото", folder: "programs" },
    { name: "badge", kind: "localized", label: "Бейдж (необязательно)", optional: true },
    { name: "cta_label", kind: "localized", label: "Текст кнопки (необязательно)", optional: true },
    { name: "cta_url", kind: "url", label: "Ссылка кнопки (необязательно)", optional: true },
    active,
  ],
};

export const PRICING_SPEC: EntitySpec = {
  table: "pricing_plans",
  title: "Тариф",
  listPath: "/admin/pricing",
  preview: "pricing",
  listColumns: [{ name: "title", label: "Название" }],
  fields: [
    slug("латиницей — напр. group-month"),
    { name: "title", kind: "localized", label: "Название" },
    { name: "description", kind: "localizedMultiline", label: "Описание (необязательно)", optional: true },
    { name: "price", kind: "number", label: "Цена" },
    { name: "old_price", kind: "number", label: "Старая цена (необязательно)", optional: true },
    currency,
    {
      name: "period",
      kind: "select",
      label: "Период",
      options: [
        { value: "month", label: "в месяц" },
        { value: "session", label: "за занятие" },
        { value: "package", label: "пакет" },
        { value: "custom", label: "свой текст" },
      ],
    },
    { name: "period_label", kind: "localized", label: "Свой текст периода", help: "используется, если период = «свой текст»", optional: true },
    { name: "sessions_count", kind: "number", label: "Кол-во тренировок (необязательно)", optional: true },
    { name: "badge", kind: "localized", label: "Бейдж (необязательно)", optional: true },
    { name: "featured", kind: "toggle", label: "Выделить карточку", defaultOn: false },
    { name: "cta_label", kind: "localized", label: "Текст кнопки (необязательно)", optional: true },
    { name: "cta_url", kind: "url", label: "Ссылка кнопки (необязательно)", optional: true },
    active,
  ],
};

export const COACHES_SPEC: EntitySpec = {
  table: "coaches",
  title: "Тренер",
  listPath: "/admin/coaches",
  preview: "coach",
  listColumns: [{ name: "name", label: "Имя" }],
  fields: [
    { name: "name", kind: "text", label: "Имя" },
    { name: "photo_url", kind: "image", label: "Фото", folder: "coaches", optional: true },
    { name: "role", kind: "localized", label: "Должность" },
    { name: "bio", kind: "localizedMultiline", label: "Описание (необязательно)", optional: true },
    { name: "experience", kind: "text", label: "Опыт (необязательно)", help: "напр. «10 лет»", optional: true },
    { name: "achievements", kind: "localizedMultiline", label: "Достижения (необязательно)", optional: true },
    { name: "instagram_url", kind: "url", label: "Instagram (необязательно)", optional: true },
    { name: "cta_url", kind: "url", label: "Ссылка для связи (необязательно)", optional: true },
    active,
  ],
};

export const SCHEDULE_SPEC: EntitySpec = {
  table: "schedule_slots",
  title: "Слот расписания",
  listPath: "/admin/schedule",
  listColumns: [{ name: "title", label: "Группа" }],
  fields: [
    {
      name: "day_of_week",
      kind: "select",
      label: "День недели",
      options: [
        { value: "0", label: "Понедельник" },
        { value: "1", label: "Вторник" },
        { value: "2", label: "Среда" },
        { value: "3", label: "Четверг" },
        { value: "4", label: "Пятница" },
        { value: "5", label: "Суббота" },
        { value: "6", label: "Воскресенье" },
      ],
    },
    { name: "time_label", kind: "text", label: "Время", help: "напр. 19:00 или 09:00 / 12:00" },
    { name: "by_arrangement", kind: "toggle", label: "По договорённости (без времени)", defaultOn: false },
    { name: "title", kind: "localized", label: "Название группы" },
    { name: "coach_id", kind: "select", label: "Тренер", options: [] }, // filled at runtime
    {
      name: "audience",
      kind: "select",
      label: "Аудитория",
      options: [
        { value: "all", label: "Общая" },
        { value: "men", label: "Мужчины" },
        { value: "women", label: "Женщины" },
        { value: "kids", label: "Дети" },
      ],
    },
    { name: "level", kind: "localized", label: "Уровень (необязательно)", optional: true },
    { name: "age_label", kind: "localized", label: "Возраст (необязательно)", optional: true },
    { name: "hall", kind: "text", label: "Зал (необязательно)", optional: true },
    { name: "note", kind: "localized", label: "Доп. текст (необязательно)", optional: true },
    active,
  ],
};

export const TESTIMONIALS_SPEC: EntitySpec = {
  table: "testimonials",
  title: "Отзыв",
  listPath: "/admin/testimonials",
  preview: "testimonial",
  listColumns: [{ name: "author", label: "Автор" }],
  fields: [
    { name: "author", kind: "text", label: "Имя автора" },
    { name: "body", kind: "localizedMultiline", label: "Текст отзыва" },
    { name: "avatar_url", kind: "image", label: "Аватар (необязательно)", folder: "testimonials", optional: true },
    active,
  ],
};

export const PRODUCTS_SPEC: EntitySpec = {
  table: "products",
  title: "Товар",
  listPath: "/admin/shop",
  preview: "product",
  listColumns: [{ name: "title", label: "Название" }],
  fields: [
    slug("латиницей — напр. glove-black"),
    { name: "title", kind: "localized", label: "Название" },
    { name: "spec", kind: "localized", label: "Характеристики", help: "напр. «12 oz · Чёрные»" },
    { name: "description", kind: "localizedMultiline", label: "Описание (необязательно)", optional: true },
    { name: "price", kind: "number", label: "Цена" },
    { name: "old_price", kind: "number", label: "Старая цена (необязательно)", optional: true },
    currency,
    { name: "image_url", kind: "image", label: "Фото", folder: "shop" },
    { name: "cta_label", kind: "localized", label: "Текст кнопки (необязательно)", optional: true },
    { name: "cta_url", kind: "url", label: "Ссылка кнопки (необязательно)", optional: true },
    active,
  ],
};

export const ADS_SPEC: EntitySpec = {
  table: "advertisements",
  title: "Кампания",
  listPath: "/admin/advertising",
  preview: "ad",
  listColumns: [{ name: "campaign_name", label: "Кампания" }],
  orderBy: "priority",
  orderDesc: true,
  reorderable: false,
  fields: [
    { name: "campaign_name", kind: "text", label: "Название кампании (внутреннее)" },
    { name: "sponsor_name", kind: "text", label: "Название партнёра (необязательно)", optional: true },
    { name: "logo_url", kind: "image", label: "Логотип партнёра (необязательно)", folder: "ads", optional: true },
    { name: "desktop_image_url", kind: "image", label: "Изображение (десктоп)", folder: "ads" },
    { name: "mobile_image_url", kind: "image", label: "Изображение (моб., необязательно)", folder: "ads", optional: true },
    { name: "title", kind: "localized", label: "Заголовок" },
    { name: "subtitle", kind: "localized", label: "Подзаголовок / предложение (необязательно)", optional: true },
    { name: "cta_label", kind: "localized", label: "Текст кнопки (необязательно)", optional: true },
    { name: "target_url", kind: "url", label: "Ссылка (куда ведёт)" },
    {
      name: "placement",
      kind: "select",
      label: "Размещение",
      options: [
        { value: "after_hero", label: "После Hero" },
        { value: "after_programs", label: "После направлений" },
        { value: "after_gallery", label: "После галереи" },
        { value: "after_pricing", label: "После цен" },
        { value: "after_schedule", label: "После расписания" },
        { value: "before_contacts", label: "Перед контактами" },
        { value: "footer", label: "В подвале" },
      ],
    },
    {
      name: "label_type",
      kind: "select",
      label: "Тип метки",
      options: [
        { value: "partner", label: "Партнёр" },
        { value: "advertisement", label: "Реклама" },
      ],
    },
    { name: "start_date", kind: "date", label: "Дата начала (необязательно)", optional: true },
    { name: "end_date", kind: "date", label: "Дата окончания (необязательно)", optional: true },
    { name: "priority", kind: "number", label: "Приоритет", help: "больше = выше в очереди показа" },
    { name: "active", kind: "toggle", label: "Активна", defaultOn: true },
  ],
};

export const HERO_FIELDS: FieldSpec[] = [
  { name: "kicker", kind: "localized", label: "Надпись сверху" },
  { name: "headline", kind: "localized", label: "Заголовок" },
  { name: "subtitle", kind: "localized", label: "Подзаголовок" },
  { name: "cta_enabled", kind: "toggle", label: "Показывать кнопку", defaultOn: true },
  { name: "cta_label", kind: "localized", label: "Текст кнопки" },
  { name: "cta_url", kind: "text", label: "Ссылка кнопки", help: "напр. tel:+37368702717 или #prices" },
  { name: "poster_url", kind: "image", label: "Фоновое фото / постер", folder: "hero" },
  { name: "video_enabled", kind: "toggle", label: "Показывать видео (десктоп)", defaultOn: true },
  { name: "video_desktop_url", kind: "text", label: "URL видео (десктоп)", help: ".webm или .mp4", optional: true },
  { name: "video_mobile_url", kind: "text", label: "URL видео (моб., необязательно)", optional: true },
];

export const SETTINGS_GENERAL_FIELDS: FieldSpec[] = [
  { name: "club_name", kind: "text", label: "Название клуба" },
  { name: "default_currency", kind: "text", label: "Валюта по умолчанию", help: "напр. MDL" },
  { name: "price_range", kind: "text", label: "Диапазон цен", help: "для поисковиков, напр. 150–4000 MDL" },
  { name: "logo_url", kind: "image", label: "Логотип", folder: "brand", optional: true, help: "если не задан — используется встроенный" },
  { name: "og_image_url", kind: "image", label: "Картинка для соцсетей (OG)", folder: "brand", optional: true },
  { name: "cta_call_label", kind: "localized", label: "Кнопка «Позвонить»" },
  { name: "route_cta_label", kind: "localized", label: "Кнопка «Открыть маршрут»" },
  { name: "book_cta_label", kind: "localized", label: "Кнопка «Записаться»" },
  { name: "default_cta_label", kind: "localized", label: "Основной CTA (текст)" },
  { name: "default_cta_url", kind: "text", label: "Основной CTA (ссылка)", optional: true },
];

export const CONTACTS_FIELDS: FieldSpec[] = [
  { name: "phone", kind: "text", label: "Телефон" },
  { name: "phone_secondary", kind: "text", label: "Доп. телефон", optional: true },
  { name: "email", kind: "text", label: "Email", optional: true },
  { name: "instagram_url", kind: "url", label: "Instagram", optional: true },
  { name: "telegram_url", kind: "url", label: "Telegram", optional: true },
  { name: "facebook_url", kind: "url", label: "Facebook", optional: true },
  { name: "address", kind: "localized", label: "Адрес" },
  { name: "map_url", kind: "url", label: "Ссылка Google Maps", optional: true },
  { name: "working_hours", kind: "localized", label: "Дни работы", help: "напр. «Понедельник — Воскресенье»" },
  { name: "hours_open", kind: "text", label: "Открытие", help: "напр. 07:00" },
  { name: "hours_close", kind: "text", label: "Закрытие", help: "напр. 21:00" },
  { name: "location_image_url", kind: "image", label: "Фото для карточки локации", folder: "brand", optional: true },
];

export const SEO_FIELDS: FieldSpec[] = [
  { name: "seo_title", kind: "localized", label: "Title (заголовок вкладки)" },
  { name: "seo_description", kind: "localizedMultiline", label: "Description (описание для поиска)" },
  { name: "og_title", kind: "localized", label: "OG Title (для соцсетей)", optional: true },
  { name: "og_description", kind: "localizedMultiline", label: "OG Description", optional: true },
  { name: "og_image_url", kind: "image", label: "OG Image", folder: "brand", optional: true },
];

export const ANNOUNCEMENT_FIELDS: FieldSpec[] = [
  { name: "announcement_active", kind: "toggle", label: "Показывать плашку-объявление", defaultOn: false },
  { name: "announcement_text", kind: "localized", label: "Текст объявления" },
  { name: "announcement_url", kind: "url", label: "Ссылка (необязательно)", optional: true },
];

export const GALLERY_SPEC: EntitySpec = {
  table: "gallery_images",
  title: "Фото галереи",
  listPath: "/admin/gallery",
  preview: "gallery",
  listColumns: [{ name: "alt", label: "Описание" }],
  fields: [
    { name: "image_url", kind: "image", label: "Фото", folder: "gallery" },
    { name: "alt", kind: "localized", label: "Alt-текст (для поиска и доступности)" },
    { name: "caption", kind: "localized", label: "Подпись (необязательно)", optional: true },
    active,
  ],
};
