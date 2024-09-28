// Create a Providers component to wrap your application with all the components requiring 'use client', such as next-nprogress-bar or your different contexts...

'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ThemeProvider } from 'next-themes';

import { ToastProvider } from '@/components/ui/toast';

const Providers = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <ToastProvider />
      </ThemeProvider>
      <ProgressBar
        height="4px"
        color="#ffffff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
