import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Local assets live under /public; formats kept modern.
    formats: ["image/avif", "image/webp"],
    // Club photos are wide; these cover phone → desktop DPR2.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
  },
  experimental: {
    optimizePackageImports: ["next-intl"],
  },
};

export default withNextIntl(nextConfig);
