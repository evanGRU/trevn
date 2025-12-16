import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "unvrcnybmjhrckffkngs.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "qzqjxcvibvybvtqottnf.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "54321",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "cdn.cloudflare.steamstatic.com",
            },
            {
                protocol: "https",
                hostname: "steamcdn-a.akamaihd.net",
            },
            {
                protocol: "https",
                hostname: "shared.fastly.steamstatic.com",
            },
            {
                protocol: "https",
                hostname: "shared.akamai.steamstatic.com",
            }
        ],
    },
};

export default nextConfig;
