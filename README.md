# Cangur Boxing Club & Gym — website

Production rebuild of the Cangur one-page site. Same visual identity as
the legacy site, rebuilt on a maintainable, CMS-driven stack.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript strict**
- **Tailwind CSS v4** (design tokens in `app/globals.css`)
- **next-intl** — `/ru` `/ro` `/en`, each language indexable
- **Supabase** (Postgres + Auth + Storage) — data layer, prepared in
  `supabase/`, wired in STEP 7–8
- **Zod** — input validation
- `next/image` — AVIF/WebP, responsive

## Layout

```
app/
  [locale]/            public site (one page, section components)
  api/track/           analytics sink (stub → STEP 13)
  sitemap.ts robots.ts
components/
  site/                Hero, Programs, Gallery, Pricing, Schedule,
                       Testimonials, Coaches, ProShop, Contacts, Header…
  ui/                  Container, Section, SectionHeading, Button, Badge
i18n/                  next-intl routing / request / navigation
lib/
  content/             typed getters + seed data (→ Supabase in STEP 8)
  analytics.ts seo.ts format.ts i18n.ts nav.ts
messages/              ru.json ro.json en.json
supabase/              draft schema (not yet applied)
legacy/                original static site — reference only, NOT built
```

## Content today

All public content is migrated verbatim from the legacy site into
`lib/content/seed.ts` (typed the same shape as the future DB). No
fabricated marketing copy. `getCoaches()` and `getAds()` return `[]`
until the owner adds real data via `/admin`.

## Scripts

```bash
npm run dev     # http://localhost:3000  → redirects to /ru
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit
```

## Not done yet (STEP 7–15)

Database migration, `/admin` (auth + CRUD for prices / schedule /
coaches / gallery / shop / ads / settings), advertising delivery,
analytics persistence, final performance pass, full QA.
