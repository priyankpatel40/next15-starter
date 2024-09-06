'use client';
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { CompanySchema } from '@/schemas';
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
import { getCompanyByName } from '@/data/company';
import { Header } from './header';
import { createCompany } from '@/actions/company';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { showToast } from '../ui/toast';

export const CompanyForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const { data: session, update } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      company_name: '',
    },
  });

  // Form submission
  const onSubmit = async (values: z.infer<typeof CompanySchema>) => {
    console.log('🚀 ~ file: company-form.tsx:44 ~ onSubmit ~ values:', values);
    setError('');
    setSuccess('');

    startTransition(() => {
      getCompanyByName(values.company_name.trim().toLowerCase())
        .then((dataResponse) => {
          if (dataResponse?.company_name) {
            setError('Sorry, This company name is already in use!');
          } else {
            createCompany(values).then((dataResponse) => {
              if (dataResponse?.success) {
                if (dataResponse.company) {
                  // Attempt to update the session
                  update({ ...session?.user, cid: dataResponse?.company?.id })
                    .then((res) => {
                      console.log('Session updated:', session);
                      showToast({
                        message: dataResponse?.success,
                        type: 'success',
                      });
                      router.push(DEFAULT_LOGIN_REDIRECT);
                    })
                    .catch((updateError) => {
                      console.error('Session update failed:', updateError);
                      setError('Failed to update your details');
                    });
                }
              } else {
                setError('Failed to create company.');
              }
            });
          }
        })

        .catch(() => {
          setError('An error occurred');
        });
    });
  };

  return (
    <section className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 ">
      <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 md:p-10 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-8 text-center">
          {/* Add your company logo here */}
          <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Create Your Company
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Let&apos;s get started by setting up your company profile.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="POST"
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="ACME Corporation"
                      className="w-full text-sm sm:text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-1" />
                </FormItem>
              )}
            />
            <div>
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <Button
              disabled={isPending}
              isLoading={isPending}
              type="submit"
              className="w-full py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 rounded-md"
            >
              Create and Continue
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};
