import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Point the plugin at our request config (cookie-based locale resolution).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Standalone output for GoDaddy/VPS deployment only.
  // On Render/Vercel, set DEPLOY_TARGET env var (or just don't set it).
  ...(process.env.DEPLOY_TARGET === "standalone" ? { output: "standalone" } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  poweredByHeader: false,
  // Image optimization: serve modern formats (sharp is installed) and cache
  // optimized variants for 30 days. next/image already handles responsive
  // sizing; this just picks smaller encodings and a longer TTL.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Tree-shake large icon/animation libraries so only the imported symbols are
  // bundled (measurable JS payload reduction on Lighthouse's "unused JS" audit).
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default withNextIntl(nextConfig);
