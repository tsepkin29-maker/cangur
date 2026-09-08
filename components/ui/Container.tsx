import type { ElementType, ReactNode } from "react";
import clsx from "clsx";

export function Container({
  as: As = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <As className={clsx("container-site", className)}>{children}</As>;
}
