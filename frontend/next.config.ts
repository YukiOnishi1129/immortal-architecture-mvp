import type { NextConfig } from "next";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: true,
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
