import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/osaka-budget",
  images: { unoptimized: true },
};

export default nextConfig;
