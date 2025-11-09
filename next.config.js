
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      // Ignore firestore.rules and backend.json from being watched
      const ignored = Array.isArray(config.watchOptions.ignored)
        ? config.watchOptions.ignored
        : [];
      config.watchOptions.ignored = [
        ...ignored,
        '**/firestore.rules',
        '**/docs/backend.json',
        '**/gcloud-application-creds.json'
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
