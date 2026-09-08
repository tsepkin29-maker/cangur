# Supabase — data layer (prepared, not yet applied)

The public site (STEP 1–6) still reads content from `lib/content/seed.ts`.
This folder holds the **draft** schema that STEP 7–8 will apply, so the
architecture is ready without touching any live data.

## Plan

| Step | Action |
| ---- | ------ |
| 7 | Create a Supabase project, apply `migrations/0001_init.sql`, enable RLS, generate `lib/supabase/database.types.ts` via `supabase gen types typescript`. |
| 8 | Swap the bodies of `lib/content/index.ts` getters to Supabase queries (same signatures). Seed the tables from `seed.ts`. |
| 9–10 | Supabase Auth (single `admin` role) + `/admin` CRUD. |
| 11 | `advertisements` wired to `<AdSlot />`. |
| 13 | `analytics_events` insert behind `/api/track`. |

## Why Supabase-only (no Prisma)

For a site of this size the Supabase typed client + plain SQL migrations
give a clear schema, real migrations, generated types and RLS-enforced
DB access with **one** dependency. Prisma would add a second client, a
second migration system and connection-pooling setup for no real gain
here. This can be revisited if the data model grows significantly.

## Applying (STEP 7, not now)

```bash
supabase init
supabase link --project-ref <ref>
supabase db push            # applies migrations/*.sql
supabase gen types typescript --linked > lib/supabase/database.types.ts
```
