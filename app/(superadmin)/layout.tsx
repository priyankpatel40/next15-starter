import '../globals.css';

import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';

import { AdminNavBar } from '../(protected)/components/navbar';

// export const experimental_ppr = true;

export const metadata: Metadata = {
  title: {
    template: 'Super Admin | Company',
    default: 'Super Admin',
  },
  description: 'Company',
};
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();
  return (
    <SessionProvider>
      <div className="flex min-h-screen w-full flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]">
        <div className="w-full">
          <AdminNavBar session={session} />
        </div>
        <div className="w-full items-center justify-center pt-16">{children}</div>
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
