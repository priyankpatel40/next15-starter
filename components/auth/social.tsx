'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

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
      callbackUrl: callbackUrl + '?from=callback',
    });
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <Button
        size="sm"
        className="w-full py-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors duration-200"
        variant="outline"
        onClick={() => onClick('google')}
        disabled={disabled}
      >
        <FcGoogle className="h-4 w-4 mr-2" />
        {googleText}
      </Button>
      <Button
        size="sm"
        className="w-full py-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors duration-200"
        variant="outline"
        onClick={() => onClick('github')}
        disabled={disabled}
      >
        <FaGithub className="h-4 w-4 mr-2" />
        {githubText}
      </Button>
    </div>
  );
};
