/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "openid-client", "util", "crypto"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
};

module.exports = nextConfig;
