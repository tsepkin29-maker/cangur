import type { ReactNode } from "react";

/**
 * The real <html>/<body> live in app/[locale]/layout.tsx so the
 * document `lang` matches the active locale. This root layout only
 * forwards children (required by Next.js).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
