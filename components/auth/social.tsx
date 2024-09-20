'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_SIGNUP_REDIRECT } from '@/routes';

export const Social = ({
  googleText = 'Login with Google',
  githubText = 'Login with Github',
  disabled = false,
  isSignIn = true,
}) => {
  let callbackUrl = '';
  const searchParams = useSearchParams();
  if (isSignIn) {
    callbackUrl = searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;
  } else {
    callbackUrl = searchParams.get('callbackUrl') || DEFAULT_SIGNUP_REDIRECT;
  }
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: `${callbackUrl}?from=callback`,
    });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        size="sm"
        className="w-full border border-gray-300 bg-white py-2 text-sm font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        variant="outline"
        onClick={() => onClick('google')}
        disabled={disabled}
      >
        <FcGoogle className="mr-2 size-4" />
        {googleText}
      </Button>
      <Button
        size="sm"
        className="w-full border border-gray-300 bg-white py-2 text-sm font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        variant="outline"
        onClick={() => onClick('github')}
        disabled={disabled}
      >
        <FaGithub className="mr-2 size-4" />
        {githubText}
      </Button>
    </div>
  );
};
