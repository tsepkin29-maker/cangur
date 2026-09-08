import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { getPricingPlans, getSettings } from "@/lib/content";
import { pick, pickMaybe } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { SectionView } from "./SectionView";
import { BookCta } from "./BookCta";

const PERIOD_KEY = {
  month: "perMonth",
  session: "perSession",
  package: "package",
} as const;

export async function Pricing() {
  const [locale, t, plans, settings] = await Promise.all([
    getLocale(),
    getTranslations("pricing"),
    getPricingPlans(),
    getSettings(),
  ]);

  if (plans.length === 0) return null;

  return (
    <Section id="prices">
      <SectionView event="pricing_view" />
      <SectionHeading kicker={t("kicker")} title={t("title")} />

      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const badge = pickMaybe(plan.badge, locale);
          const description = pickMaybe(plan.description, locale);
          const cta = pickMaybe(plan.ctaLabel, locale);
          const periodText =
            plan.period === "custom"
              ? pickMaybe(plan.periodLabel, locale)
              : t(PERIOD_KEY[plan.period]);
          return (
            <li
              key={plan.id}
              className={`hover-lift relative flex flex-col overflow-hidden rounded-card border bg-[linear-gradient(145deg,#161616,#101010)] p-5 ${
                plan.featured
                  ? "border-red/40 shadow-[0_0_28px_rgba(237,27,63,0.09)]"
                  : "border-line"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[13px] font-extrabold text-[#b8b8bd]">
                  {pick(plan.title, locale)}
                </span>
                {badge ? <Badge>{badge}</Badge> : null}
              </div>

              {description ? (
                <p className="mt-2 text-[13px] leading-snug text-faint">
                  {description}
                </p>
              ) : null}

              <div className="mt-auto flex items-baseline gap-2 pt-6">
                <strong className="text-[clamp(1.6rem,4vw,1.95rem)] font-black leading-none tracking-[-0.035em]">
                  {formatPrice(plan.price, plan.currency)}
                </strong>
                {plan.oldPrice ? (
                  <s className="text-sm text-faint">
                    {formatPrice(plan.oldPrice, plan.currency)}
                  </s>
                ) : null}
              </div>
              {periodText ? (
                <small className="mt-1.5 text-[13px] text-faint">
                  {periodText}
                </small>
              ) : null}

              {cta && plan.ctaUrl ? (
                <a
                  href={plan.ctaUrl}
                  className="mt-3 inline-block text-[13px] font-black text-red-soft hover:text-white"
                >
                  {cta}
                </a>
              ) : null}

              <span className="absolute inset-x-[10%] bottom-0 h-0.5 bg-gradient-to-r from-transparent via-red to-transparent opacity-40 shadow-[0_0_15px_rgba(237,27,63,0.65)]" />
            </li>
          );
        })}
      </ul>

      <p className="mt-4 max-w-[52ch] text-sm text-muted">{t("note")}</p>

      <BookCta
        phone={settings.phoneHref}
        phoneDisplay={settings.phoneDisplay}
        label={pick(settings.bookCtaLabel, locale) || t("bookCta")}
      />
    </Section>
  );
}
