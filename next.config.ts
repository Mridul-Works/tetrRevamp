import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 85 for large feature photos (e.g. the 10 Things panels); 75 everywhere else
    qualities: [75, 85],
    // Photos are served from Tetr's CDN buckets, not from /public
    remotePatterns: [
      { protocol: "https", hostname: "cdn.tetr.com" },
      { protocol: "https", hostname: "cdn.unionstack.in" },
    ],
  },
};

export default nextConfig;
