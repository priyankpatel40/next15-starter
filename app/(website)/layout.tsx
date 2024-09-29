import '../globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getLocale } from 'next-intl/server';

import Providers from '@/components/providers';
import Footer from '@/components/ui/footer';
import NavBarMenu from '@/components/ui/navbar';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://speculumapp.xyz';
  const logoPath = '../public/logo-light.png';
  const title = 'NextJS 15 Enterprise Starter-kit';
  const description =
    'Kickstart your enterprise-grade project with our robust, secure, and scalable Next.js 15 boilerplate';
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    verification: {
   google: 'ioGHJouKXs042dZWKBuZ6EpCNrwrq20iYK4Kzs896Ps'
  },
    authors: [
      {
        name: 'Priyank Patel',
        url: 'https://github.com/priyankpatel40',
      },
    ],
    twitter: {
      card: 'summary_large_image',
      creator: 'Priyank Patel',
      images: logoPath,
    },
    robots: 'index, follow',
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-US': '/',
      },
    },
    openGraph: {
      type: 'website',
      url: baseUrl,
      title,
      description,
      siteName: title,
      images: [
        {
          url: logoPath,
        },
      ],
    },
    assets: logoPath,
    keywords: [
      'Next.js',
      'Next.js 15',
      'Next.js enterprise starter kit',
      'Next.js boilerplate',
      'NextAuth',
      'NextAuth v5',
      'Auth.js',
      'Prisma',
      'Next.js with Prisma',
      'Enterprise starter kit',
      'Magic link authentication',
      'Dashboard template',
      'Admin panel',
      'Next.js TypeScript',
      'TypeScript starter kit',
      'Tailwind CSS',
      'Next.js Tailwind',
      'Enterprise SaaS boilerplate',
      'Next.js admin panel',
      'Full-stack starter kit',
      'Next.js enterprise-grade app',
    ],
  };
}
const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <NavBarMenu />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
};
export default RootLayout;
