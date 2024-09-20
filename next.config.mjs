/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./i18n/requests.ts');

const nextConfig = {
  experimental: {
    ppr: "incremental",
  },
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
  }
  
};
 
export default withNextIntl(nextConfig);

