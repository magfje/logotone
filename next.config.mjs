/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["localhost", "localhost:3000", "utfs.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
      //   {
      //     protocol: "http",
      //     hostname: "localhost",
      //     port: "3000",
      //     pathname: "/**",
      //   },
    ],
  },
};

export default config;
