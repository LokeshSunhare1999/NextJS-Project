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
      {
        protocol: "https",
        hostname: "rare-rabbit-541.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
