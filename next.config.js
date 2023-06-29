/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["127.0.0.1", "localhost","43.205.110.252.nip.io"]
  }
};

module.exports = nextConfig;
