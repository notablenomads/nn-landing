/** @type {import('next').NextConfig} */
const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medium.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.medium.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

initOpenNextCloudflareForDev();
