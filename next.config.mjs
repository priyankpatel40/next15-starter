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
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
};
 
export default withNextIntl(nextConfig);

