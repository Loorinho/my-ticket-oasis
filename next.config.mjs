/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
      {
        hostname: "incredible-ant-483.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
