-- ============================================================================
-- Cangur — initial schema  (DRAFT — not applied until STEP 7)
--
-- Localised text is stored as jsonb: { "ru": "...", "ro": "...", "en": "..." }.
-- Read access is public (anon) for active rows; writes require the `admin`
-- role and go through the service-role key on the server only.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- settings — single row (id = true)
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  id                boolean primary key default true check (id),
  phone             text not null,
  phone_display     text not null,
  instagram_url     text not null,
  instagram_handle  text not null,
  telegram_url      text,
  address_line      jsonb not null,
  map_url           text not null,
  work_hours        jsonb not null,
  hours_open        text not null default '07:00',
  hours_close       text not null default '21:00',
  price_range       text not null default '150–4000 MDL',
  announcement      jsonb,               -- { text: {ru,ro,en}, active: bool } | null
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- programs — the 4 training directions
-- ---------------------------------------------------------------------------
create table if not exists public.programs (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('men','women','kids','personal')),
  title        jsonb not null,
  body         jsonb not null,
  image_url    text not null,
  image_width  int not null,
  image_height int not null,
  active       boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pricing_plans
-- ---------------------------------------------------------------------------
create table if not exists public.pricing_plans (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          jsonb not null,
  description    jsonb,
  price          numeric(10,2) not null,
  old_price      numeric(10,2),
  currency       text not null default 'MDL',
  period         text not null check (period in ('month','session','package')),
  sessions_count int,
  badge          jsonb,
  featured       boolean not null default false,
  active         boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- coaches
-- ---------------------------------------------------------------------------
create table if not exists public.coaches (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  photo_url     text,
  role          jsonb not null,
  bio           jsonb,
  instagram_url text,
  active        boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- schedule_slots — one row per lesson
-- ---------------------------------------------------------------------------
create table if not exists public.schedule_slots (
  id             uuid primary key default gen_random_uuid(),
  day_of_week    int not null check (day_of_week between 0 and 6), -- 0 = Monday
  time_label     text not null default '',    -- '19:00' | '09:00 / 12:00' | ''
  by_arrangement boolean not null default false,
  title          jsonb not null,
  coach_id       uuid references public.coaches(id) on delete set null,
  audience       text not null default 'all' check (audience in ('all','men','women','kids')),
  active         boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- gallery_images
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  width      int not null,
  height     int not null,
  alt        jsonb not null,
  active     boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- products — Pro Shop
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  spec         jsonb not null,
  price        numeric(10,2) not null,
  currency     text not null default 'MDL',
  image_url    text not null,
  image_width  int not null,
  image_height int not null,
  active       boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  body       jsonb not null,
  author     text not null,
  active     boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- advertisements
-- ---------------------------------------------------------------------------
create table if not exists public.advertisements (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  subtitle        text,
  image_url       text not null,
  mobile_image_url text,
  target_url      text not null,
  sponsor_name    text,
  placement       text not null check (placement in
                    ('home_top','home_middle','pricing','schedule','footer')),
  priority        int not null default 0,
  start_date      timestamptz,
  end_date        timestamptz,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- analytics_events (STEP 13)
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id         bigint generated always as identity primary key,
  name       text not null,
  path       text not null,
  locale     text,
  meta       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_name_created_idx
  on public.analytics_events (name, created_at desc);

-- ---------------------------------------------------------------------------
-- admin_users — role check for /admin (STEP 9). Auth itself is Supabase Auth;
-- this table maps an auth user to the `admin` role.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.settings         enable row level security;
alter table public.programs         enable row level security;
alter table public.pricing_plans    enable row level security;
alter table public.coaches          enable row level security;
alter table public.schedule_slots   enable row level security;
alter table public.gallery_images   enable row level security;
alter table public.products         enable row level security;
alter table public.testimonials     enable row level security;
alter table public.advertisements   enable row level security;
alter table public.analytics_events enable row level security;
alter table public.admin_users      enable row level security;

-- Public read of active content rows.
create policy "public read active" on public.programs
  for select using (active);
create policy "public read active" on public.pricing_plans
  for select using (active);
create policy "public read active" on public.coaches
  for select using (active);
create policy "public read active" on public.schedule_slots
  for select using (active);
create policy "public read active" on public.gallery_images
  for select using (active);
create policy "public read active" on public.products
  for select using (active);
create policy "public read active" on public.testimonials
  for select using (active);
create policy "public read settings" on public.settings
  for select using (true);
create policy "public read live ads" on public.advertisements
  for select using (
    active
    and (start_date is null or start_date <= now())
    and (end_date   is null or end_date   >= now())
  );

-- Writes: admin only. `is_admin()` checks the mapping table.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Applied per content table in STEP 9 once auth exists, e.g.:
--   create policy "admin write" on public.programs
--     for all using (public.is_admin()) with check (public.is_admin());

-- analytics_events: no client access at all; only the service role
-- (which bypasses RLS) inserts from /api/track.
