//import { Poppins } from 'next/font/google';

import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';

// const font = Poppins({
//   weight: ['400', '700'],
//   subsets: ['latin'],
// });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ">
      <div className="space-y-6 text-center">
        <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md')}>
          Speculum
        </h1>
        <p className="text-white text-lg">A simple authentication service</p>
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
