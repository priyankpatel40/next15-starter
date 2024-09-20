'use client';

import { logout } from '@/actions/logout';

import { Button } from '../ui/button';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <Button onClick={onClick} className="cursor-pointer">
      {children}
    </Button>
  );
};
