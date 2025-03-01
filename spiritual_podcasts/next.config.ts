import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "lovely-flamingo-139.convex.cloud",
        hostname: "i.scdn.co",
      },
    ],
  },
};

export default nextConfig;
