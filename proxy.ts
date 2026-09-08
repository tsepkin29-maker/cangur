import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the "middleware" convention to "proxy".
// next-intl's handler is unchanged — it redirects "/" to the default
// locale and rewrites "/ru" | "/ro" | "/en" requests.
export default createMiddleware(routing);

export const config = {
  // Run on every path except Next internals, API routes and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
