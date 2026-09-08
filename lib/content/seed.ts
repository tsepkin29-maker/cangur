/**
 * Seed content — migrated verbatim from the legacy static site
 * (legacy/original-index.html, legacy/extracted-content.json).
 *
 * This is the single source of truth until STEP 7–8, when the same
 * data moves into Supabase. No fabricated / placeholder marketing data:
 * every value below already existed on the live cangur.md site.
 */

import type {
  Advertisement,
  Coach,
  GalleryImage,
  PricingPlan,
  Product,
  Program,
  ScheduleSlot,
  SiteSettings,
  Testimonial,
} from "./types";

export const settings: SiteSettings = {
  phone: "+37368702717",
  phoneDisplay: "+373 68 702 717",
  instagramUrl: "https://www.instagram.com/cangur_boxingclub/",
  instagramHandle: "@cangur_boxingclub",
  telegramUrl: null,
  addressLine: {
    ru: "Кишинёв, Ботаника, Grădina Botanică 2",
    ro: "Chișinău, Botanica, Grădina Botanică 2",
    en: "Chișinău, Botanica, Grădina Botanică 2",
  },
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Gradina+Botanica+2+Chisinau",
  workHours: {
    ru: "Понедельник — Воскресенье",
    ro: "Luni — Duminică",
    en: "Monday — Sunday",
  },
  hoursOpen: "07:00",
  hoursClose: "21:00",
  priceRange: "150–4000 MDL",
  announcement: null,
};

export const programs: Program[] = [
  {
    id: "men",
    type: "men",
    title: { ru: "Мужской бокс", ro: "Box pentru bărbați", en: "Men's boxing" },
    text: {
      ru: "Техника, мешки, лапы, выносливость и спарринги.",
      ro: "Tehnică, sac, palmare, rezistență și sparring.",
      en: "Technique, bags, pads, endurance and sparring.",
    },
    image: "/images/program-men.webp",
    imageWidth: 1100,
    imageHeight: 1467,
    active: true,
    sortOrder: 1,
  },
  {
    id: "women",
    type: "women",
    title: { ru: "Женский бокс", ro: "Box feminin", en: "Women's boxing" },
    text: {
      ru: "Сила, координация, форма и уверенность.",
      ro: "Forță, coordonare, formă și încredere.",
      en: "Strength, coordination, fitness and confidence.",
    },
    image: "/images/program-women.webp",
    imageWidth: 1100,
    imageHeight: 825,
    active: true,
    sortOrder: 2,
  },
  {
    id: "kids",
    type: "kids",
    title: { ru: "Детский бокс", ro: "Box pentru copii", en: "Kids boxing" },
    text: {
      ru: "Дисциплина, реакция и безопасная техника.",
      ro: "Disciplină, reacție și tehnică sigură.",
      en: "Discipline, reactions and safe technique.",
    },
    image: "/images/program-kids.webp",
    imageWidth: 1100,
    imageHeight: 825,
    active: true,
    sortOrder: 3,
  },
  {
    id: "personal",
    type: "personal",
    title: { ru: "Персонально", ro: "Individual", en: "Personal training" },
    text: {
      ru: "Индивидуальный план и работа один на один.",
      ro: "Plan individual și lucru unu la unu.",
      en: "Individual plan and one-to-one coaching.",
    },
    image: "/images/program-personal.webp",
    imageWidth: 864,
    imageHeight: 1536,
    active: true,
    sortOrder: 4,
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "group-month",
    slug: "group-month",
    title: { ru: "Групповой бокс", ro: "Box de grup", en: "Group boxing" },
    description: null,
    price: 1000,
    oldPrice: null,
    currency: "MDL",
    period: "month",
    sessionsCount: null,
    badge: { ru: "Популярно", ro: "Popular", en: "Popular" },
    featured: false,
    active: true,
    sortOrder: 1,
  },
  {
    id: "group-single",
    slug: "group-single",
    title: {
      ru: "Разовая групповая",
      ro: "Antrenament de grup · o ședință",
      en: "Single group session",
    },
    description: null,
    price: 150,
    oldPrice: null,
    currency: "MDL",
    period: "session",
    sessionsCount: null,
    badge: null,
    featured: false,
    active: true,
    sortOrder: 2,
  },
  {
    id: "personal-session",
    slug: "personal-session",
    title: { ru: "Персонально", ro: "Individual", en: "Personal training" },
    description: null,
    price: 450,
    oldPrice: null,
    currency: "MDL",
    period: "session",
    sessionsCount: null,
    badge: null,
    featured: true,
    active: true,
    sortOrder: 3,
  },
  {
    id: "personal-10",
    slug: "personal-10",
    title: {
      ru: "10 персональных",
      ro: "10 antrenamente individuale",
      en: "10 personal sessions",
    },
    description: null,
    price: 4000,
    oldPrice: null,
    currency: "MDL",
    period: "package",
    sessionsCount: 10,
    badge: null,
    featured: false,
    active: true,
    sortOrder: 4,
  },
  {
    id: "mini-class",
    slug: "mini-class",
    title: {
      ru: "Мини-класс · 2 человека",
      ro: "Mini-clasă · 2 persoane",
      en: "Mini class · 2 people",
    },
    description: null,
    price: 600,
    oldPrice: null,
    currency: "MDL",
    period: "session",
    sessionsCount: null,
    badge: null,
    featured: false,
    active: true,
    sortOrder: 5,
  },
  {
    id: "mini-group",
    slug: "mini-group",
    title: {
      ru: "Мини-группа · 3+",
      ro: "Mini-grup · 3+",
      en: "Mini group · 3+",
    },
    description: null,
    price: 250,
    oldPrice: null,
    currency: "MDL",
    period: "session",
    sessionsCount: null,
    badge: null,
    featured: false,
    active: true,
    sortOrder: 6,
  },
];

const T_GROUP = { ru: "Групповой бокс", ro: "Box de grup", en: "Group boxing" };
const T_KIDS_59 = { ru: "Дети 5–9 лет", ro: "Copii 5–9 ani", en: "Kids 5–9" };
const T_KIDS_1016 = {
  ru: "Дети 10–16 лет",
  ro: "Copii 10–16 ani",
  en: "Kids 10–16",
};
const T_MINI_GROUP = {
  ru: "Мини-группа · 3+",
  ro: "Mini-grup · 3+",
  en: "Mini group · 3+",
};
const T_WOMEN_MINI = {
  ru: "Мини-группа для девушек",
  ro: "Mini-grup pentru femei",
  en: "Women's mini group",
};
const T_PERSONAL = {
  ru: "Персонально",
  ro: "Individual",
  en: "Personal training",
};

export const scheduleSlots: ScheduleSlot[] = [
  // Monday
  { id: "mon-1", dayOfWeek: 0, time: "17:00", byArrangement: false, title: T_KIDS_59, coachId: null, audience: "kids", active: true, sortOrder: 1 },
  { id: "mon-2", dayOfWeek: 0, time: "18:00", byArrangement: false, title: T_KIDS_1016, coachId: null, audience: "kids", active: true, sortOrder: 2 },
  { id: "mon-3", dayOfWeek: 0, time: "19:00", byArrangement: false, title: T_GROUP, coachId: null, audience: "all", active: true, sortOrder: 3 },
  // Tuesday
  { id: "tue-1", dayOfWeek: 1, time: "09:00 / 12:00", byArrangement: false, title: T_MINI_GROUP, coachId: null, audience: "all", active: true, sortOrder: 1 },
  { id: "tue-2", dayOfWeek: 1, time: "19:00", byArrangement: false, title: T_WOMEN_MINI, coachId: null, audience: "women", active: true, sortOrder: 2 },
  // Wednesday
  { id: "wed-1", dayOfWeek: 2, time: "17:00", byArrangement: false, title: T_KIDS_59, coachId: null, audience: "kids", active: true, sortOrder: 1 },
  { id: "wed-2", dayOfWeek: 2, time: "18:00", byArrangement: false, title: T_KIDS_1016, coachId: null, audience: "kids", active: true, sortOrder: 2 },
  { id: "wed-3", dayOfWeek: 2, time: "19:00", byArrangement: false, title: T_GROUP, coachId: null, audience: "all", active: true, sortOrder: 3 },
  // Thursday
  { id: "thu-1", dayOfWeek: 3, time: "09:00 / 12:00", byArrangement: false, title: T_MINI_GROUP, coachId: null, audience: "all", active: true, sortOrder: 1 },
  { id: "thu-2", dayOfWeek: 3, time: "19:00", byArrangement: false, title: T_WOMEN_MINI, coachId: null, audience: "women", active: true, sortOrder: 2 },
  // Friday
  { id: "fri-1", dayOfWeek: 4, time: "17:00", byArrangement: false, title: T_KIDS_59, coachId: null, audience: "kids", active: true, sortOrder: 1 },
  { id: "fri-2", dayOfWeek: 4, time: "18:00", byArrangement: false, title: T_KIDS_1016, coachId: null, audience: "kids", active: true, sortOrder: 2 },
  { id: "fri-3", dayOfWeek: 4, time: "19:00", byArrangement: false, title: T_GROUP, coachId: null, audience: "all", active: true, sortOrder: 3 },
  // Saturday
  { id: "sat-1", dayOfWeek: 5, time: "11:00", byArrangement: false, title: T_WOMEN_MINI, coachId: null, audience: "women", active: true, sortOrder: 1 },
  // Sunday
  { id: "sun-1", dayOfWeek: 6, time: "", byArrangement: true, title: T_PERSONAL, coachId: null, audience: "all", active: true, sortOrder: 1 },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "/gallery/gallery-1.webp",
    width: 1200,
    height: 905,
    alt: {
      ru: "Ринг и груши в зале Cangur Boxing Club с неоновой подсветкой",
      ro: "Ring și saci de box în sala Cangur Boxing Club, cu iluminare neon",
      en: "Ring and heavy bags at Cangur Boxing Club under neon lighting",
    },
    active: true,
    sortOrder: 1,
  },
  {
    id: "g2",
    src: "/gallery/gallery-2.webp",
    width: 1200,
    height: 905,
    alt: {
      ru: "Зона отдыха и витрина с экипировкой в Cangur Boxing Club",
      ro: "Zonă de relaxare și vitrină cu echipament la Cangur Boxing Club",
      en: "Lounge area and equipment display at Cangur Boxing Club",
    },
    active: true,
    sortOrder: 2,
  },
  {
    id: "g3",
    src: "/gallery/gallery-3.webp",
    width: 1200,
    height: 905,
    alt: {
      ru: "Боксёрский ринг с грушами под неоновой рамкой в клубе Cangur",
      ro: "Ring de box cu saci sub o ramă neon în clubul Cangur",
      en: "Boxing ring with bags under a neon frame at Cangur club",
    },
    active: true,
    sortOrder: 3,
  },
  {
    id: "g4",
    src: "/gallery/gallery-4.webp",
    width: 1200,
    height: 905,
    alt: {
      ru: "Силовая зона со штангой и гантелями рядом с рингом",
      ro: "Zonă de forță cu bară și gantere lângă ring",
      en: "Strength area with barbell and dumbbells next to the ring",
    },
    active: true,
    sortOrder: 4,
  },
  {
    id: "g5",
    src: "/gallery/gallery-5.webp",
    width: 1200,
    height: 905,
    alt: {
      ru: "Функциональная зона тренировок с кардиотренажёрами и инвентарём",
      ro: "Zonă de antrenament funcțional cu aparate cardio și inventar",
      en: "Functional training area with cardio machines and equipment",
    },
    active: true,
    sortOrder: 5,
  },
  {
    id: "g6",
    src: "/gallery/gallery-6.webp",
    width: 1200,
    height: 905,
    alt: {
      ru: "Угол ринга с канатами в зале Cangur Boxing Club",
      ro: "Colț de ring cu corzi în sala Cangur Boxing Club",
      en: "Ring corner with ropes at Cangur Boxing Club",
    },
    active: true,
    sortOrder: 6,
  },
  {
    id: "g7",
    src: "/gallery/gallery-7.webp",
    width: 1200,
    height: 905,
    alt: {
      ru: "Зеркальный зал с отражением ринга и тренажёров",
      ro: "Sală cu oglinzi în care se reflectă ringul și aparatele",
      en: "Mirrored hall reflecting the ring and machines",
    },
    active: true,
    sortOrder: 7,
  },
];

export const products: Product[] = [
  {
    id: "glove-black",
    slug: "black",
    title: "12th Round Black",
    spec: { ru: "12 oz · Чёрные", ro: "12 oz · Negre", en: "12 oz · Black" },
    price: 1300,
    currency: "MDL",
    image: "/shop/glove-black.webp",
    imageWidth: 900,
    imageHeight: 900,
    active: true,
    sortOrder: 1,
  },
  {
    id: "glove-pink",
    slug: "pink",
    title: "12th Round Pink",
    spec: { ru: "12 oz · Розовые", ro: "12 oz · Roz", en: "12 oz · Pink" },
    price: 1300,
    currency: "MDL",
    image: "/shop/glove-pink.webp",
    imageWidth: 900,
    imageHeight: 900,
    active: true,
    sortOrder: 2,
  },
  {
    id: "glove-white",
    slug: "white",
    title: "12th Round White",
    spec: { ru: "12 oz · Белые", ro: "12 oz · Albe", en: "12 oz · White" },
    price: 1300,
    currency: "MDL",
    image: "/shop/glove-white.webp",
    imageWidth: 900,
    imageHeight: 900,
    active: true,
    sortOrder: 3,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "r1",
    text: {
      ru: "«Пришёл без опыта. Через несколько недель уже почувствовал технику и уверенность.»",
      ro: "«Am venit fără experiență. După câteva săptămâni am simțit deja progresul.»",
      en: "“I came with no experience. After a few weeks I already felt real progress.”",
    },
    author: "Alex",
    active: true,
    sortOrder: 1,
  },
  {
    id: "r2",
    text: {
      ru: "«Ребёнок ходит с удовольствием. Хорошая атмосфера и внимательный тренер.»",
      ro: "«Copilul vine cu plăcere. Atmosferă bună și antrenor atent.»",
      en: "“My child enjoys every session. Great atmosphere and an attentive coach.”",
    },
    author: "Maria",
    active: true,
    sortOrder: 2,
  },
  {
    id: "r3",
    text: {
      ru: "«Персональные тренировки дают очень быстрый прогресс.»",
      ro: "«Antrenamentele individuale oferă progres rapid.»",
      en: "“Personal training gives very fast progress.”",
    },
    author: "Victor",
    active: true,
    sortOrder: 3,
  },
];

/** No coach data existed on the legacy site — the owner adds real
 *  coaches via /admin (STEP 10). Section stays hidden while empty. */
export const coaches: Coach[] = [];

/** Advertising infrastructure is ready (STEP 11); no campaigns yet. */
export const advertisements: Advertisement[] = [];
