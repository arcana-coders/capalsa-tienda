import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagenes.tecnomata.com',
      },
      {
        // Por si algún producto tiene imagen directa de Amazon
        protocol: 'https',
        hostname: '*.amazon.com',
      },
      {
        protocol: 'https',
        hostname: '*.ssl-images-amazon.com',
      },
    ],
  },
};

export default nextConfig;
