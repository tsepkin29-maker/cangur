import type { ReactNode } from "react";
import clsx from "clsx";

/**
 * Kicker + title pair used above every section (legacy `.label` + `.title`).
 * `as` controls the heading level so the document keeps a clean
 * h1 → h2 → h3 hierarchy.
 */
export function SectionHeading({
  kicker,
  title,
  as: As = "h2",
  srSuffix,
  className,
  children,
}: {
  kicker: string;
  title: ReactNode;
  as?: "h1" | "h2";
  srSuffix?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={clsx("mb-6", className)}>
      <p className="text-[11px] font-black uppercase tracking-[0.17em] text-red-soft">
        {kicker}
      </p>
      <As className="mt-2 font-display text-[clamp(2rem,7vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.045em] [overflow-wrap:break-word]">
        {title}
        {srSuffix ? <span className="sr-only">{srSuffix}</span> : null}
      </As>
      {children}
    </div>
  );
}
