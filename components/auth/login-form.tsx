'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import UAParser from 'ua-parser-js';
import type * as z from 'zod';

import { login, loginWithLink, resendCode } from '@/actions/login';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { EnterCode } from '@/components/auth/enter-code';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import logger from '@/lib/logger';
import { type LoginLinkSchema, LoginSchema } from '@/schemas';

import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';

const LoginForm = () => {
  const t = useTranslations('LoginPage');
  const g = useTranslations('General');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? undefined;
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [resetCode, setResetCode] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'link' | 'password'>('link');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLinkSubmit = async (values: z.infer<typeof LoginLinkSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    setResetCode(false);

    startTransition(async () => {
      try {
        const data = await loginWithLink(values, callbackUrl);
        form.reset();

        if (data?.error) {
          setError(data.message);
        }

        if (data?.success) {
          setSuccess(data.message);
        }
      } catch {
        setError('Something went wrong');
      }
    });
  };

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    setResetCode(false);

    startTransition(async () => {
      try {
        if (loginMethod === 'link') {
          await handleLinkSubmit({ email: values.email });
        } else {
          const data = await login(values, callbackUrl);
          form.reset();

          if (data?.error) {
            setError(data.message);
          }

          if (data?.success) {
            setSuccess(data.message);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
            setCooldown(60);
          }
        }
      } catch {
        setError('Something went wrong');
      }
    });
  };

  const onCodeSubmit = async (code: string) => {
    if (isValidating) return;

    setError(undefined);
    setSuccess(undefined);
    setIsValidating(true);

    try {
      const data = await login({ ...form.getValues(), code }, callbackUrl);

      if (data?.error) {
        setError(data.message);
        setResetCode(true);
      } else if (data?.success) {
        setSuccess(data.message);
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsValidating(false);
    }
  };

  const handleResendCode = async () => {
    setError(undefined);
    setSuccess(undefined);
    setIsResending(true);

    try {
      const data = await resendCode(form.getValues().email);

      if (data?.error) {
        setError(data.message);
      } else if (data?.success) {
        setSuccess(data.message);
        setResetCode(true);
        setCooldown(60);
      }
    } catch {
      setError('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const parser = new UAParser();
    const userAgentInfo = parser.getResult();
    logger.info('User agent info:', userAgentInfo);

    Cookies.set('userAgent', JSON.stringify(userAgentInfo), { expires: 1 });
  }, []);

  const toggleLoginMethod = () => {
    setLoginMethod((prev) => (prev === 'link' ? 'password' : 'link'));
    setError(undefined);
    setSuccess(undefined);
  };
  const getResendButtonText = () => {
    if (isResending) {
      return t('resendTxt');
    }
    if (cooldown > 0) {
      return `${t('resendBtn')} (${cooldown}s)`;
    }
    return t('resendBtn');
  };
  return (
    <CardWrapper
      cardClasses="w-full max-w-md mx-auto shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-200"
      headerLabel={t('headerLabel')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref="/register"
      showSocial={{
        isVisible: true,
        googleText: t('googleText'),
        gitHubText: t('gitHubText'),
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="space-y-4">
            {showTwoFactor ? (
              <FormField
                control={form.control}
                name="code"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('enterCode')}
                    </FormLabel>
                    <FormControl>
                      <EnterCode
                        callback={onCodeSubmit}
                        reset={resetCode}
                        isLoading={isValidating}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={handleResendCode}
                      disabled={isResending || cooldown > 0 || isValidating}
                      className="mt-2 text-xs font-normal text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {getResendButtonText()}
                    </Button>
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {g('email')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
                          className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    loginMethod === 'password'
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {g('password')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="******"
                            type="password"
                            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                        <Button
                          size="sm"
                          variant="link"
                          className="mt-2 text-xs font-normal text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
                          asChild
                        >
                          <Link href="/reset">{t('forgotPwd')}</Link>
                        </Button>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </div>

          <Button
            disabled={isPending || isValidating}
            type="submit"
            isLoading={isPending}
            className="w-full rounded-md bg-primary py-0 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            {loginMethod === 'link' ? t('btnLink') : t('btn')}
          </Button>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />
        </form>
      </Form>

      <div className="mt-0 text-center">
        <Button
          type="button"
          variant="link"
          onClick={toggleLoginMethod}
          className="text-sm font-normal text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {loginMethod === 'link' ? t('loginPwd') : t('loginLink')}
        </Button>
      </div>
    </CardWrapper>
  );
};

export default LoginForm;
