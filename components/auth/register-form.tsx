'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

import register from '@/actions/register';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
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
import { RegisterSchema } from '@/schemas';

import { Card } from '../ui/card';
import BackButton from './back-button';
import { Header } from './header';
import { Social } from './social';

const RegisterForm = () => {
  const t = useTranslations('RegistrationPage');
  const g = useTranslations('General');
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });
  // Form submition
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      register(values).then((data) => {
        if (data.success) {
          setSuccess(data.success);
        } else if (data.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <section className="flex min-h-screen items-center justify-center p-4 ">
      <Card className="w-full min-w-[360px] max-w-lg rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 sm:min-w-[380px] md:min-w-[448px]">
        <Form {...form}>
          <Header label={t('headerLabel')} />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="POST"
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{g('name')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        className="w-full rounded-md border focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{g('email')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="w-full rounded-md border focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{g('password')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                        className="w-full rounded-md border focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-2">
                <FormError message={error} />
                <FormSuccess message={success} />
              </div>
              <Button
                disabled={isPending}
                isLoading={isPending}
                type="submit"
                className="mt-5 w-full py-2.5 text-sm font-semibold"
              >
                {t('btn')}
              </Button>
              <div className="relative my-6 flex items-center justify-center">
                <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
                <span className="absolute bg-white px-3 text-sm font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  or
                </span>
              </div>
              <div className="space-y-4">
                <Social
                  googleText={t('googleText')}
                  githubText={t('gitHubText')}
                  isSignIn={false}
                />
              </div>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <BackButton label={t('backButtonLabel')} href="/login" />
        </div>
      </Card>
    </section>
  );
};

export default RegisterForm;
