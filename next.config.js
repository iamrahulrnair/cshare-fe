/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["127.0.0.1", "localhost","api.cshare.lol","avatars.githubusercontent.com"]
  }
};

module.exports = nextConfig;
