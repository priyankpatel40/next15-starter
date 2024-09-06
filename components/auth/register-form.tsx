'use client';
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { register } from '@/actions/register';
import { BackButton } from './back-button';
import { Social } from './social';
import { Header } from './header';
import { Card } from '../ui/card';

export const RegisterForm = () => {
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
    console.log(values);
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
    <section className="flex items-center justify-center min-h-screen p-4 ">
      <Card className="w-full min-w-[360px] sm:min-w-[380px] md:min-w-[448px] max-w-lg p-8 shadow-lg rounded-xl bg-white dark:bg-gray-800">
        <Form {...form}>
          <Header label="Create your account" />
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        className="w-full border rounded-md focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="w-full border rounded-md focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                        className="w-full border rounded-md focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                className="w-full mt-5 py-2.5 text-sm font-semibold"
              >
                Create an account
              </Button>
              <div className="flex items-center justify-center my-6 relative">
                <hr className="w-full h-px bg-gray-200 dark:bg-gray-700 border-0" />
                <span className="absolute px-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                  or
                </span>
              </div>
              <div className="space-y-4">
                <Social
                  googleText="Sign up with Google"
                  githubText="Sign up with Github"
                  isSignIn={false}
                />
              </div>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <BackButton label="Already have an account?" href="/login" />
        </div>
      </Card>
    </section>
  );
};
