import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pizzeria.sebastien-petit.fr',
                pathname: '/images/**',
            }
        ]
    }
};

export default nextConfig;