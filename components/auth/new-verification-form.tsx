'use client';

import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { newVerification } from '@/actions/new-verification';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setError('Missing token!');
      setIsLoading(false);
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => {
        setError('Something went wrong! Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <CardWrapper
        headerLabel="Account Verification"
        backButtonLabel="Back to login"
        backButtonHref="/login"
        cardClasses="w-full max-w-md shadow-lg"
      >
        <div className="flex size-full flex-col items-center justify-center space-y-4 p-6">
          {isLoading && (
            <div className="flex flex-col items-center space-y-2">
              <ArrowPathIcon className="size-12 animate-spin text-black dark:text-white" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verifying your account...
              </p>
            </div>
          )}
          {success && !isLoading && (
            <div className="text-center">
              <FormSuccess message={success} />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Redirecting to login...
              </p>
            </div>
          )}
          {!success && error && !isLoading && (
            <div className="text-center">
              <FormError message={error} />
            </div>
          )}
        </div>
      </CardWrapper>
    </div>
  );
};
