import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  //trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  //skipTrailingSlashRedirect: true,

  images: {
    unoptimized: true,
  },
  output: "export",
  exclude: ["api", "middleware","/app/api","/middleware"],
  outputFileTracingExcludes: {
        '*': ['app/api**',"/api"], // Example: Exclude everything in 'path/to/exclude'
      },
};

export default nextConfig;
