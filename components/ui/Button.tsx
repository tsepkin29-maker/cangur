import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "red" | "dark" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition-shadow duration-200";

const variants: Record<Variant, string> = {
  red: "bg-red text-white shadow-[0_0_18px_rgba(237,27,63,0.26)] hover:shadow-[0_0_14px_rgba(237,27,63,0.58),0_0_34px_rgba(237,27,63,0.2)]",
  dark: "border border-line bg-panel-2 text-white hover:border-red/50",
  ghost: "text-red-soft hover:text-white",
};

export function Button({
  variant = "red",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "red",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={clsx(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
