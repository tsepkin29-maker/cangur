import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../globals.css";
import "./admin.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Cangur — админка",
  robots: { index: false, follow: false },
};

/** Admin lives outside the [locale] tree, so it renders its own
 *  <html>/<body>. The auth guard + sidebar live in (panel)/layout.tsx
 *  so /admin/login and /admin/auth can render without them. */
export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <div className="admin-root">{children}</div>
      </body>
    </html>
  );
}
