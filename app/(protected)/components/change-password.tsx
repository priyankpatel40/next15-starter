'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

import { changePassword } from '@/actions/change-password';
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
import { showToast } from '@/components/ui/toast';
import { ChangePasswordSchema } from '@/schemas';

const ChangePasswordForm = ({ isOAuth }: { isOAuth: boolean }) => {
  const [error, setError] = useState<string | undefined>();
  const [success] = useState<string | undefined>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const t = useTranslations('ProfilePage');

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    setIsPending(true);
    try {
      const data = await changePassword(values);
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        showToast({
          message: data.success,
          type: 'success',
        });
      }
    } catch (err) {
      setError('Something went wrong!');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">{t('changePassword')}</h2>
      {!isOAuth ? (
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('newPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                      required
                      className="border border-gray-300 focus:border-gray-400 dark:border-gray-700 dark:focus:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                      required
                      className="border border-gray-300 focus:border-gray-400 dark:border-gray-700 dark:focus:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
              {t('updatePassword')}
            </Button>
          </form>
        </Form>
      ) : (
        <h2>{t('oAuth')}</h2>
      )}
    </>
  );
};
export default ChangePasswordForm;
