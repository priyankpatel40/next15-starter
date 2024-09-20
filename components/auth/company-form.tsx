'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

import { createCompany } from '@/actions/company';
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
import { getCompanyByName } from '@/data/company';
import logger from '@/lib/logger';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { CompanySchema } from '@/schemas';

import { showToast } from '../ui/toast';

const CompanyForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      companyName: '',
    },
  });

  // Form submission
  const onSubmit = async (values: z.infer<typeof CompanySchema>) => {
    logger.info('🚀 ~ file: company-form.tsx:44 ~ onSubmit ~ values:', values);
    setError('');
    setSuccess('');

    startTransition(() => {
      getCompanyByName(values.companyName.trim().toLowerCase())
        .then((dataResponse) => {
          if (dataResponse?.companyName) {
            setError('Sorry, This company name is already in use!');
          } else {
            createCompany(values).then((result) => {
              if (result.success) {
                showToast({
                  message: result.success,
                  type: 'success',
                });
                router.push(DEFAULT_LOGIN_REDIRECT);
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
    <section className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8 ">
      <div className="w-full max-w-[90%] rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:max-w-lg md:p-10 lg:max-w-xl">
        <div className="mb-8 text-center">
          {/* Add your company logo here */}
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
            <svg
              className="size-12 text-gray-600 dark:text-gray-400"
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
          <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl md:text-4xl">
            Create Your Company
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
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
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="ACME Corporation"
                      className="w-full rounded-md border border-gray-300 bg-gray-50 text-sm text-gray-900 transition-all duration-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-gray-400 dark:focus:ring-gray-400 sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-xs text-red-500 dark:text-red-400 sm:text-sm" />
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
              className="  w-full rounded-md py-2.5 text-sm font-semibold transition-colors duration-200"
            >
              Create and Continue
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};
export default CompanyForm;
