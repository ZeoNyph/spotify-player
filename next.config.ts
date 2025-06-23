import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.scdn.co",
        pathname: "/image/**"
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "*.spotifycdn.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
