/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: [
    {
      protocol: 'http',
      hostname: '127.0.0.1',
      port: 8000,
    },
  ],
};

module.exports = nextConfig;
