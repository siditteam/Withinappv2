import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@within/ui", "@within/config", "@within/validation", "@within/analytics"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
