//import { Poppins } from 'next/font/google';

import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';
import { useTranslations } from 'next-intl';
export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <main className="flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ">
      <div className="space-y-6 text-center">
        <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md')}>
          Company
        </h1>
        <p className="text-white text-lg">{t('tagLine')}</p>
        <div>
          <LoginButton asChild>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
