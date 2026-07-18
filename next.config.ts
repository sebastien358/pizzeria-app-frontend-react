import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,  // true tout le temps, plus de condition NODE_ENV
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api-pizzeria.sebastien-petit.fr',
                pathname: '/images/**',
            }
        ]
    }
};

export default nextConfig;