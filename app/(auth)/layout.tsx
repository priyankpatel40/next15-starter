import '../globals.css';

import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import Providers from '@/components/providers';
import ThemeSwitch from '@/components/themeSwtich';
import LocaleSwitcher from '@/components/ui/localSwitcher';

const inter = Inter({ subsets: ['latin'] });

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
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
              <div className="relative flex h-auto min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]">
                <div className="absolute right-12 top-4 flex space-x-4">
                  <ThemeSwitch />
                  <LocaleSwitcher />
                </div>
                {children}
              </div>
            </Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default AuthLayout;
