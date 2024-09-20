'use client';

import { useRouter } from 'next/navigation';

import LoginForm from '@/components/auth/login-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { Button } from '../ui/button';

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

const LoginButton = ({ children, mode = 'redirect', asChild }: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push('/login');
  };

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto border-none bg-transparent p-0">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button onClick={onClick} className="cursor-pointer">
      {children}
    </Button>
  );
};

export default LoginButton;
