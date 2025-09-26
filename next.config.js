/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "openid-client", "util", "crypto"],
};

module.exports = nextConfig;
