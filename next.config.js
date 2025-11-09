const nextConfig = {
  output: 'standalone', // 👈 force Vercel to build a server app, not static export
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
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
