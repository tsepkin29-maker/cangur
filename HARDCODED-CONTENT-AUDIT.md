# HARDCODED CONTENT AUDIT

Scope: everything user-visible on the public site. For each item —
**SYSTEM UI** (developer-owned, stays in code) or **CONTENT** (must be
CMS-editable). Done after STEP 7–13.

Legend: ✅ already CMS-driven · 🟡 in `messages/*.json` (translator-editable,
not day-to-day content) · 🔴 still hardcoded, should move to CMS.

---

## 1. Fully CMS-driven ✅

| Area | Source | Admin page |
| --- | --- | --- |
| Hero: kicker, headline, subtitle, CTA text + link, CTA on/off, video on/off, poster, desktop/mobile video URL | `hero` table | `/admin/hero` |
| Programs: title, description, photo, badge, CTA, order, active (+ add/delete) | `programs` | `/admin/programs` |
| Gallery: photo, alt ×3, caption ×3, order, active (+ add/delete) | `gallery_images` | `/admin/gallery` |
| Pricing: title ×3, description ×3, price, old price, currency, period, custom period label ×3, sessions count, badge ×3, featured, CTA, order, active | `pricing_plans` | `/admin/pricing` |
| Schedule: day, time, "by arrangement", group name ×3, coach, audience, level ×3, age ×3, hall, note ×3, order, active | `schedule_slots` | `/admin/schedule` |
| Coaches: name, photo, role ×3, bio ×3, experience, achievements ×3, Instagram, contact link, order, active | `coaches` | `/admin/coaches` |
| Testimonials: author, text ×3, avatar, order, active | `testimonials` | `/admin/testimonials` |
| Pro Shop: title ×3, spec ×3, description ×3, price, old price, currency, photo, CTA ×3, CTA URL, order, active | `products` | `/admin/shop` |
| Contacts: phone, 2nd phone, email, Instagram, Telegram, Facebook, address ×3, Maps URL, working hours ×3, open/close time, location image | `settings` | `/admin/contacts` |
| Club name, currency, price range, logo, OG image, CTA labels (call / route / book / default) ×3, default CTA URL | `settings` | `/admin/settings` |
| Announcement bar: text ×3, link, on/off | `settings` | `/admin/announcement` |
| SEO: title ×3, description ×3, OG title ×3, OG description ×3, OG image | `settings` | `/admin/seo` |
| Navigation: per-item label override ×3, visibility, order | `nav_items` | `/admin/navigation` |
| Advertising: every field (see spec) | `advertisements` | `/admin/advertising` |

## 2. Content images — CMS-driven ✅

All content photos upload to Supabase Storage (`media` bucket) and are
referenced by URL from the DB: Hero poster, Programs, Gallery, Coaches,
Products, Testimonial avatars, Ads (desktop + mobile + logo), Logo, OG
image, Contacts location image.

The **migrated seed images still physically live in `/public`**
(`/public/images`, `/public/gallery`, `/public/shop`, `/public/video`,
`/public/brand`) and the DB rows point at those paths. That is
intentional: the owner replaces any of them with an upload at any time,
and the row switches to the Storage URL. Nothing needs a code change.

## 3. `messages/*.json` — translator-editable UI 🟡

These are short interface strings, not day-to-day content. Editing them
needs a developer/translator, not the owner, so they live in the i18n
files rather than the DB:

- Section kickers + titles: `programs` (h1 "ВЫБЕРИ ТРЕНИРОВКУ" / "ALEGE
  ANTRENAMENTUL" / "CHOOSE YOUR TRAINING"), `gallery`, `pricing`,
  `schedule`, `testimonials`, `shop`, `coaches`, `contacts`
- Period words: "в месяц / за занятие / пакет"
- Schedule: weekday names, "График работы", "07:00 — 21:00", "По
  договорённости", the by-arrangement note
- Pricing note ("Точную стоимость … уточняйте по телефону")
- Gallery arrow labels, ProShop "Подробнее"/"Закрыть", Coaches "Написать"
- Nav fallback labels (used only if `nav_items.label` override is empty)
- Ad label words "Реклама" / "Партнёр" (the *choice* per campaign is in
  the DB via `label_type`; only the two words themselves are here)
- a11y: "Перейти к содержимому", "Прогресс прокрутки", menu open/close
- Contact row labels "Telegram" / "Email" (literal in `ContactLinks.tsx`)
- Footer `© {year} Cangur Boxing Club & Gym`

**Recommendation:** leave as-is for now. If the owner later wants to edit
section headings themselves, the cleanest move is to add a `sections`
table (key → title ×3 + kicker ×3) and swap these `t()` calls for a
getter — the components already localise everything the same way, so it
is a mechanical change, not a rebuild. Not doing it now avoids
over-engineering for text that essentially never changes.

## 4. Genuinely hardcoded, by design — SYSTEM UI ✅ (no action)

- The wordmark next to the logo: `CANGUR` / `BOXING CLUB & GYM`
  (`Header.tsx`) — brand lockup, part of the visual identity. The logo
  **image** is CMS-driven; the typeset wordmark is design.
- Fallback asset paths when a DB field is empty: `/brand/logo.webp`,
  `/video/hero-poster.jpg`, `/video/hero.webm|mp4`. These only render if
  the owner clears the field without setting a new one.
- Favicon / `app/icon.png` / `apple-icon.png` — **deploy-driven on
  purpose.** Browsers and CDNs cache favicons aggressively and Next
  fingerprints them at build; a CMS-swapped favicon would be unreliable
  and is not worth the complexity. `logo` and `og_image` (which matter
  for SEO/social) *are* editable. If the club rebrands, the favicon is a
  1-line file swap + deploy.
- JSON-LD structure (`lib/seo.ts`) — schema.org shape is code; every
  value inside it (phone, address, hours, price range, image) is read
  from `settings`.
- `hreflang`, `canonical`, `robots`, `sitemap` — system-generated from
  the locale list and `NEXT_PUBLIC_SITE_URL`. The admin SEO panel
  deliberately cannot touch these (safety).
- CSS design tokens (`app/globals.css`) — colours, type, spacing, glow.
  Visual system, not content.
- Analytics event names, ARIA roles/labels, DOM selectors, class names.

## 5. Nothing found that is content and still hardcoded 🔴

No prices, schedule entries, coach data, gallery items, product data,
testimonials, contact details, hero copy, ad content or nav labels remain
in the component code. `coaches` and `advertisements` ship empty — the
owner adds real rows in `/admin`.

---

## Verdict

Content lives in the database; code owns layout and logic. The only
user-visible text still in the repo is (a) short UI chrome in
`messages/*.json` (deliberate, documented in §3) and (b) the typeset
brand wordmark + safety fallbacks (§4). Favicon stays deploy-driven with
a written rationale; logo and OG image are editable.
