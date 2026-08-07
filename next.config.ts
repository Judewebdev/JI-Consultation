import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma's engine and bcrypt's native bindings must stay outside the bundle.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
