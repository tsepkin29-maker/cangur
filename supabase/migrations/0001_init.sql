-- ============================================================================
-- Cangur — full CMS schema
--
-- Conventions
--   * localised text  -> jsonb  { "ru": "...", "ro": "...", "en": "..." }
--     (partial objects are fine; the app falls back ru -> first available)
--   * every content row has  active boolean  +  sort_order int
--   * public (anon) can SELECT active rows; only `admin` can write
--   * images are URLs into the public Storage bucket `media`
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- admin_users  — maps a Supabase Auth user to the single `admin` role
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- role check used by RLS and by the app
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public, auth as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- settings — single row (id = true). "General Settings" + Contacts + SEO +
-- brand media + announcement, all in one editable record.
-- ---------------------------------------------------------------------------
create table public.settings (
  id                    boolean primary key default true check (id),

  club_name             text  not null default 'Cangur Boxing Club & Gym',

  -- contacts
  phone                 text  not null,
  phone_secondary       text,
  email                 text,
  instagram_url         text,
  telegram_url          text,
  facebook_url          text,
  address               jsonb not null default '{}'::jsonb,
  map_url               text,
  working_hours         jsonb not null default '{}'::jsonb,
  hours_open            text  not null default '07:00',
  hours_close           text  not null default '21:00',
  location_image_url    text,

  -- money
  default_currency      text  not null default 'MDL',
  price_range           text  not null default '150–4000 MDL',

  -- reusable CTA labels (localised)
  cta_call_label        jsonb not null default '{}'::jsonb,  -- header "call" button
  route_cta_label       jsonb not null default '{}'::jsonb,  -- "open directions"
  book_cta_label        jsonb not null default '{}'::jsonb,  -- pricing "book"
  default_cta_label     jsonb not null default '{}'::jsonb,
  default_cta_url       text,

  -- announcement bar
  announcement_text     jsonb not null default '{}'::jsonb,
  announcement_url      text,
  announcement_active   boolean not null default false,

  -- brand media
  logo_url              text,
  og_image_url          text,

  -- SEO (per-locale)
  seo_title             jsonb not null default '{}'::jsonb,
  seo_description       jsonb not null default '{}'::jsonb,
  og_title              jsonb not null default '{}'::jsonb,
  og_description        jsonb not null default '{}'::jsonb,

  updated_at            timestamptz not null default now()
);
create trigger settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- hero — single row (id = true)
-- ---------------------------------------------------------------------------
create table public.hero (
  id                boolean primary key default true check (id),
  kicker            jsonb not null default '{}'::jsonb,
  headline          jsonb not null default '{}'::jsonb,
  subtitle          jsonb not null default '{}'::jsonb,
  cta_label         jsonb not null default '{}'::jsonb,
  cta_url           text  not null default '',
  cta_enabled       boolean not null default true,
  video_enabled     boolean not null default true,
  poster_url        text  not null default '',
  video_desktop_url text,
  video_mobile_url  text,
  updated_at        timestamptz not null default now()
);
create trigger hero_updated before update on public.hero
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- nav_items — fixed set of system sections; admin controls label + visibility
-- + order only (routes/anchors are code-owned and cannot be added/removed).
-- ---------------------------------------------------------------------------
create table public.nav_items (
  key         text primary key
              check (key in ('programs','gallery','prices','shop','schedule','coaches','contacts')),
  label       jsonb not null default '{}'::jsonb,   -- optional override; empty -> i18n default
  visible     boolean not null default true,
  sort_order  int not null default 0
);

-- ---------------------------------------------------------------------------
-- programs
-- ---------------------------------------------------------------------------
create table public.programs (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        jsonb not null default '{}'::jsonb,
  description  jsonb not null default '{}'::jsonb,
  image_url    text not null default '',
  badge        jsonb,
  cta_label    jsonb,
  cta_url      text,
  active       boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger programs_updated before update on public.programs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- pricing_plans
-- ---------------------------------------------------------------------------
create table public.pricing_plans (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          jsonb not null default '{}'::jsonb,
  description    jsonb,
  price          numeric(10,2) not null default 0,
  old_price      numeric(10,2),
  currency       text not null default 'MDL',
  period         text not null default 'session'
                 check (period in ('month','session','package','custom')),
  period_label   jsonb,                 -- used when period = 'custom'
  sessions_count int,
  badge          jsonb,
  featured       boolean not null default false,
  cta_label      jsonb,
  cta_url        text,
  active         boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger pricing_updated before update on public.pricing_plans
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- coaches
-- ---------------------------------------------------------------------------
create table public.coaches (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  photo_url     text,
  role          jsonb not null default '{}'::jsonb,
  bio           jsonb,
  experience    text,
  achievements  jsonb,
  instagram_url text,
  cta_url       text,
  active        boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger coaches_updated before update on public.coaches
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- schedule_slots — one row per lesson
-- ---------------------------------------------------------------------------
create table public.schedule_slots (
  id             uuid primary key default gen_random_uuid(),
  day_of_week    int not null check (day_of_week between 0 and 6),  -- 0 = Monday
  time_label     text not null default '',
  by_arrangement boolean not null default false,
  title          jsonb not null default '{}'::jsonb,
  coach_id       uuid references public.coaches(id) on delete set null,
  level          jsonb,
  audience       text not null default 'all' check (audience in ('all','men','women','kids')),
  age_label      jsonb,
  hall           text,
  note           jsonb,
  active         boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger schedule_updated before update on public.schedule_slots
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  author     text not null,
  body       jsonb not null default '{}'::jsonb,
  avatar_url text,
  active     boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger testimonials_updated before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- products — Pro Shop (no checkout, content only)
-- ---------------------------------------------------------------------------
create table public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        jsonb not null default '{}'::jsonb,
  spec         jsonb not null default '{}'::jsonb,
  description  jsonb,
  price        numeric(10,2) not null default 0,
  old_price    numeric(10,2),
  currency     text not null default 'MDL',
  image_url    text not null default '',
  cta_label    jsonb,
  cta_url      text,
  active       boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_images
-- ---------------------------------------------------------------------------
create table public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  alt        jsonb not null default '{}'::jsonb,
  caption    jsonb,
  active     boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- advertisements
-- ---------------------------------------------------------------------------
create table public.advertisements (
  id                uuid primary key default gen_random_uuid(),
  campaign_name     text not null,
  sponsor_name      text,
  logo_url          text,
  desktop_image_url text not null default '',
  mobile_image_url  text,
  title             jsonb not null default '{}'::jsonb,
  subtitle          jsonb,
  cta_label         jsonb,
  target_url        text not null default '',
  placement         text not null
                    check (placement in ('after_hero','after_programs','after_gallery',
                                         'after_pricing','after_schedule','before_contacts','footer')),
  label_type        text not null default 'partner' check (label_type in ('advertisement','partner')),
  start_date        timestamptz,
  end_date          timestamptz,
  priority          int not null default 0,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger ads_updated before update on public.advertisements
  for each row execute function public.set_updated_at();
create index advertisements_placement_idx
  on public.advertisements (placement, active, priority desc);

-- ---------------------------------------------------------------------------
-- analytics_events — page + CTA + ad events
-- ---------------------------------------------------------------------------
create table public.analytics_events (
  id         bigint generated always as identity primary key,
  name       text not null,
  path       text not null default '',
  locale     text,
  meta       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index analytics_events_name_idx on public.analytics_events (name, created_at desc);
create index analytics_events_ad_idx
  on public.analytics_events ((meta->>'adId')) where meta ? 'adId';

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.admin_users      enable row level security;
alter table public.settings         enable row level security;
alter table public.hero             enable row level security;
alter table public.nav_items        enable row level security;
alter table public.programs         enable row level security;
alter table public.pricing_plans    enable row level security;
alter table public.coaches          enable row level security;
alter table public.schedule_slots   enable row level security;
alter table public.testimonials     enable row level security;
alter table public.products         enable row level security;
alter table public.gallery_images   enable row level security;
alter table public.advertisements   enable row level security;
alter table public.analytics_events enable row level security;

-- admin_users: a user can see their own row; admins see all. No client writes.
create policy admin_users_read on public.admin_users
  for select using (auth.uid() = user_id or public.is_admin());

-- Singletons: world-readable, admin-writable.
create policy settings_read  on public.settings  for select using (true);
create policy settings_write on public.settings  for all using (public.is_admin()) with check (public.is_admin());
create policy hero_read      on public.hero      for select using (true);
create policy hero_write     on public.hero      for all using (public.is_admin()) with check (public.is_admin());
create policy nav_read       on public.nav_items for select using (true);
create policy nav_write      on public.nav_items for all using (public.is_admin()) with check (public.is_admin());

-- Content tables: public sees active rows, admin sees + writes everything.
do $$
declare t text;
begin
  foreach t in array array[
    'programs','pricing_plans','coaches','schedule_slots',
    'testimonials','products','gallery_images'
  ] loop
    execute format(
      'create policy %1$s_read on public.%1$s for select using (active or public.is_admin());', t);
    execute format(
      'create policy %1$s_write on public.%1$s for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- Ads: public sees only currently-live campaigns; admin sees + writes all.
create policy ads_read_public on public.advertisements
  for select using (
    public.is_admin()
    or (active
        and (start_date is null or start_date <= now())
        and (end_date   is null or end_date   >= now()))
  );
create policy ads_write on public.advertisements
  for all using (public.is_admin()) with check (public.is_admin());

-- analytics_events: no client access at all. Writes come from the server
-- via the service-role key (which bypasses RLS). Admin can read aggregates.
create policy analytics_read on public.analytics_events
  for select using (public.is_admin());

-- ============================================================================
-- Storage bucket for all CMS-managed media
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media admin write" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
