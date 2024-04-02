/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bungie.net",
        port: "",
      },

      {
        protocol: "https",
        hostname: "www.bungie.net",
        port: "",
      },
    ],
  },
};

export default nextConfig;
