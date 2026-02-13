import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // 1. GÖRSEL KAYNAĞI GÜVENLİK AYARI (remotePatterns)
    images: {
        unoptimized: true,
    },
};

export default nextConfig;