import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
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
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
