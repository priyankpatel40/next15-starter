import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { auth } from '@/auth';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yourcompany.com'),
    title: 'NextJS 15 Enterprise Starter-kit',
    description:
      'Kickstart your enterprise-grade project with our robust, secure, and scalable Next.js 15 boilerplate',
    authors: [
      {
        name: 'Priyank Patel',
        url: 'https://github.com/priyankpatel40',
      },
    ],
    twitter: {
      card: 'summary_large_image',
      creator: 'Priyank Patel',
      images: '../public/logo-light.png',
    },
    robots: 'index, follow',
    alternates: {
      canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://yourcompany.com',
      languages: {
        'en-US': '/',
      },
    },
    openGraph: {
      type: 'website',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourcompany.com',
      title: 'NextJS 15 Enterprise Starter-kit',
      description:
        'Kickstart your enterprise-grade project with our robust, secure, and scalable Next.js 15 boilerplate',
      siteName: 'NextJS 15 Enterprise Starter-kit',
      images: [
        {
          url: '../public/logo-light.png',
        },
      ],
    },
    assets: '../public/logo-light.png',
    keywords: [
      'nextjs',
      'nextjs15',
      'next-auth',
      'authjs',
      'next-authv5',
      'prisma',
      'boilerplate',
      'starterkit',
      'enterprise',
      'magiclink',
      'dashboard',
      'adminpanel',
      'typescript',
      'tailwind',
    ],
  };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <SessionProvider session={session}>
      <html lang={locale}>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
        </head>
        <body className={inter.className}>
          <NextIntlClientProvider messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
