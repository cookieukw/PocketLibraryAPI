
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    unoptimized: true,
  },
   distDir: 'build',
};

module.exports = nextConfig;