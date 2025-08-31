import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },{
        protocol: "https",
        hostname: "static.vecteezy.com", // ✅ allow your logo domain
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
