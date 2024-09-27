'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import AppConfig from '@/config';
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_SIGNUP_REDIRECT } from '@/routes';

interface SocialProps {
  googleText?: string;
  githubText?: string;
  disabled?: boolean;
  isSignIn?: boolean;
}

export const Social = ({
  googleText = 'Login with Google',
  githubText = 'Login with Github',
  disabled = false,
  isSignIn = true,
}: SocialProps) => {
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get('callbackUrl') ||
    (isSignIn ? DEFAULT_LOGIN_REDIRECT : DEFAULT_SIGNUP_REDIRECT);

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: `${callbackUrl}?from=callback`,
    });
  };

  // Correct conditional rendering
  if (!AppConfig.useGoogleOauth && !AppConfig.useGithubOauth) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      {AppConfig.useGoogleOauth && (
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
      )}
      {AppConfig.useGithubOauth && (
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
      )}
    </div>
  );
};
