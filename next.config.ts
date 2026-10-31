import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");
    if (!apiUrl) return [];
    return [
      {
        // Keep /api/media handled directly by Next.js App Router
        source: "/api/:path((?!media).*)",
        destination: `${apiUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
