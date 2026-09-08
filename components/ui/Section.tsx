import type { ReactNode } from "react";
import clsx from "clsx";
import { Container } from "./Container";

/**
 * Consistent vertical rhythm for every block:
 * ~44px top/bottom on phones, ~58px from tablet up (legacy values).
 */
export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={clsx("scroll-mt-24 py-11 sm:py-[58px]", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
