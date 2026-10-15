import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only "N" indicator badge (bottom-left circle) in development.
  devIndicators: false,

  images: {
    // AVIF where the browser supports it (~20% smaller), WebP otherwise
    formats: ["image/avif", "image/webp"],
    // Optimised images stay cached for 31 days (or longer if the source's
    // Cache-Control says so — see vercel.json)
    minimumCacheTTL: 2678400,
  },

  experimental: {
    // Tailwind CSS is small, so inline it in <head> instead of a render-blocking <link>
    inlineCss: true,
  },
};

export default nextConfig;
