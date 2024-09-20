import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { auth } from '@/auth';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Company',
  description: 'Company',
};

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
