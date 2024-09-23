'use client';

import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('VerificationPage');

  useEffect(() => {
    if (!token) {
      setError(t('error'));
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
        setError(t('error'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <CardWrapper
        headerLabel={t('headerLabel')}
        backButtonLabel={t('backButtonLabel')}
        backButtonHref="/login"
        cardClasses="w-full max-w-md shadow-lg"
      >
        <div className="flex size-full flex-col items-center justify-center space-y-4 p-6">
          {isLoading && (
            <div className="flex flex-col items-center space-y-2">
              <ArrowPathIcon className="size-12 animate-spin text-black dark:text-white" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('title')}</p>
            </div>
          )}
          {success && !isLoading && (
            <div className="text-center">
              <FormSuccess message={success} />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t('success')}
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
