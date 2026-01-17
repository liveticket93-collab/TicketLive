import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "brandemia.org",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "images.mlssoccer.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.billboard.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "imagenes.elpais.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "imagenes.heraldo.es",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
        pathname: "/**"
      },
    ],
  },
};

export default nextConfig;
