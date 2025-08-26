/** @type {import('next').NextConfig} */
const nextConfig = {
    staticPageGenerationTimeout: 150,
    serverExternalPackages: ['mongoose', 'bcrypt'],
    // Optimize for deployment
    output: 'standalone',
    poweredByHeader: false,
    serverExternalPackages: ['mongoose', 'bcrypt'],
    experimental: {},
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push({
                'utf-8-validate': 'commonjs utf-8-validate',
                'bufferutil': 'commonjs bufferutil',
            })
        }
        return config
    },
    async redirects() {
        return [
            {
                source: '/problems',
                destination: '/problems-new',
                permanent: false,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
