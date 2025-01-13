/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
});

const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn-images-1.medium.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'medium.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.medium.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'miro.medium.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
};
// @ts-ignore
module.exports = withPWA(nextConfig);
