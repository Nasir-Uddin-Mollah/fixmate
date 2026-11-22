import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co", pathname: "/**" },
      { protocol: "https", hostname: "i.imgbb.com", pathname: "/**" },
    ],
  },
  experimental: {
    agentFeedback: true,
    // Auth-guarded routes intentionally redirect at request time. Next 16's
    // default instant-navigation validation treats that redirect as a render
    // error and repeats it in the dev overlay on every navigation. Validate
    // only segments that explicitly opt in with `instant = true`.
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
