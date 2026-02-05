import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
let apiHostname: string | null = null;
try {
  if (apiUrl) apiHostname = new URL(apiUrl).hostname;
} catch {
  // invalid URL
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      ...(apiHostname
        ? [
            { protocol: "https" as const, hostname: apiHostname, pathname: "/media/**" },
            { protocol: "http" as const, hostname: apiHostname, pathname: "/media/**" },
          ]
        : []),
      { protocol: "https", hostname: "front-mission.bigs.or.kr", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },
};

export default nextConfig;
