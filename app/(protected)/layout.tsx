import '../globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { auth } from '@/auth';
import Providers from '@/components/providers';

import { AdminNavBar } from './components/adminNavbar';

export const metadata: Metadata = {
  title: {
    template: '%s | Company',
    default: 'Company',
  },
  description: 'Company',
};
interface ProtectedLayoutProps {
  children: React.ReactNode;
}
const inter = Inter({ subsets: ['latin'] });
const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <div className="flex min-h-screen w-full flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]">
                <div className="w-full">
                  <AdminNavBar session={session} />
                </div>
                <div className="w-full items-center justify-center pt-16">{children}</div>
              </div>
            </Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default ProtectedLayout;
