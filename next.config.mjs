!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

const domains = ["cdn.discordapp.com", "media.tenor.com"]

if (process.env.NODE_ENV === "development") {
  domains.push("avatars.githubusercontent.com", "cloudflare-ipfs.com")
}

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    // esmExternals: false,
  },
  reactStrictMode: true,
  images: {
    domains
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
