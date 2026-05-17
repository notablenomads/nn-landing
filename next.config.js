/** @type {import('next').NextConfig} */
const { withSerwist } = require("@serwist/turbopack");

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
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

module.exports = withSerwist(nextConfig);
