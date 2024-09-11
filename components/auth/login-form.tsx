'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import { login, resendCode } from '@/actions/login';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { EnterCode } from '@/components/auth/enter-code';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Cookies from 'js-cookie';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import UAParser from 'ua-parser-js';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [resetCode, setResetCode] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

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

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');
    setResetCode(false);

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
            setCooldown(60);
          }
        })
        .catch(() => setError('Something went wrong'));
    });
  };

  const onCodeSubmit = async (code: string) => {
    if (isValidating) return; // Prevent multiple submissions

    setError('');
    setSuccess('');
    setIsValidating(true); // Set this early to block subsequent submissions

    try {
      const data = await login({ ...form.getValues(), code }, callbackUrl);

      if (data?.error) {
        setError(data.error);
        setResetCode(true); // Reset the code input field if needed
      } else if (data?.success) {
        setSuccess(data.success);
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setIsValidating(false); // Ensure this runs in every exit path
    }
  };

  const handleResendCode = () => {
    setError('');
    setSuccess('');
    setIsResending(true);
    resendCode(form.getValues().email)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data?.success) {
          setSuccess(data.success);
          setResetCode(true);
          setCooldown(60); // Start the 60-second cooldown
        }
      })
      .catch(() => setError('Failed to resend code'))
      .finally(() => setIsResending(false));
  };
  useEffect(() => {
    const parser = new UAParser();
    const userAgentInfo = parser.getResult();
    console.log(
      '🚀 ~ file: login-form.tsx:131 ~ useEffect ~ userAgentInfo:',
      userAgentInfo,
    );

    // Save user agent info in a cookie
    Cookies.set('userAgent', JSON.stringify(userAgentInfo), { expires: 1 }); // Expires in 7 days
  }, []);

  return (
    <section className="flex items-center justify-center min-h-screen p-4 ">
      <CardWrapper
        cardClasses="w-full min-w-[360px] sm:min-w-[380px] md:min-w-[448px] max-w-lg shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-200"
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/register"
        showSocial={{
          isVisible: true,
          googleText: 'Login with Google',
          gitHubText: 'Login with Github',
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {showTwoFactor ? (
                <FormField
                  control={form.control}
                  name="code"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm pb-2 font-medium text-gray-700 dark:text-gray-300">
                        Enter your two factor code
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
                        className="mt-2 px-0 font-normal text-xs text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {isResending
                          ? 'Resending...'
                          : cooldown > 0
                            ? `Resend code (${cooldown}s)`
                            : 'Resend code'}
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
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="john.doe@example.com"
                            type="email"
                            className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="******"
                            type="password"
                            className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          />
                        </FormControl>
                        <Button
                          size="sm"
                          variant="link"
                          asChild
                          className="px-0 font-normal text-xs text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Link href="/reset">Forgot password?</Link>
                        </Button>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            {!showTwoFactor && (
              <Button
                disabled={isPending}
                type="submit"
                className="w-full py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-md"
                isLoading={isPending}
              >
                Login
              </Button>
            )}
          </form>
        </Form>
      </CardWrapper>
    </section>
  );
};
