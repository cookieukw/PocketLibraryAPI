import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  //trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  //skipTrailingSlashRedirect: true,

  images: {
    unoptimized: true,
  },

};

export default nextConfig;
