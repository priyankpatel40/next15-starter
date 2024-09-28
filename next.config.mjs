/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./i18n/requests.ts');

const nextConfig = {
  experimental: {
    ppr: "incremental",
    serverExternalPackages: ['pino',
      '@react-email/components',
            '@react-email/render',
            '@react-email/tailwind'],
  },
   transpilePackages: [
    '@react-email/components',
    '@react-email/render',
    '@react-email/html',
  ],
   images: {
    domains: ['avatars.githubusercontent.com','lh3.googleusercontent.com'],
  },
  eslint: {
   // ignoreDuringBuilds: true,
  },
  typescript: {
   // ignoreBuildErrors: true,
  },
   webpack: (config) => {
    config.externals.push({
      "thread-stream": "commonjs thread-stream"
    });
    return config;
  },
   async rewrites() {
    return [
      {
        source: '/',
        destination: '/home', // This maps '/' to '/home'
      },
    ];
  },
  
};
 
export default withNextIntl(nextConfig);

