import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only "N" indicator badge (bottom-left circle) in development.
  devIndicators: false,
};

export default nextConfig;
