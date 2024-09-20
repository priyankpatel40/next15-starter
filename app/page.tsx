import { useTranslations } from 'next-intl';

import LoginButton from '@/components/auth/login-button';
import { cn } from '@/utils/helpers';

export default function Home() {
  const t = useTranslations('HomePage'); // Using type assertion

  return (
    <main className="flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ">
      <div className="space-y-6 text-center">
        <h1 className={cn('text-6xl font-semibold drop-shadow-md')}>Company</h1>
        <p className="text-lg ">{t('tagLine')}</p> {/* Ensure key matches */}
        <div>
          <LoginButton>Sign in</LoginButton>
        </div>
      </div>
    </main>
  );
}
