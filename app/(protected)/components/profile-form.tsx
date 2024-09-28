'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

import { settings } from '@/actions/settings';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { showToast } from '@/components/ui/toast';
import { SettingsSchema } from '@/schemas';

const ProfileForm = ({
  name,
  email,
  isTwoFactorEnabled,
  isOAuth,
}: {
  name: string | null;
  email: string | null;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}) => {
  const [error, setError] = useState<string | undefined>();
  const [success] = useState<string | undefined>();
  const { update } = useSession();
  const t = useTranslations('ProfilePage');
  const g = useTranslations('General');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: name || '',
      email: email || '',
      isTwoFactorEnabled,
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof SettingsSchema>) => {
      startTransition(() => {
        settings(values)
          .then((data) => {
            console.log('🚀 ~ .then ~ data:', data);
            if (data.error) {
              setError(data.message);
            }
            if (data.success) {
              showToast({
                message: data.message,
                type: 'success',
              });
              update();
            }
          })
          .catch(() => setError('Something went wrong!'));
      });
    },
    [update],
  );

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="mb-6 text-2xl font-semibold">{t('title')}</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{g('name')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="John Doe"
                  disabled={isPending}
                  className="border border-gray-300 focus:border-gray-400 dark:border-gray-700 dark:focus:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isOAuth && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{g('email')}</FormLabel>
                  <FormControl>
                    <div className="group relative">
                      <Input
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled
                        className="cursor-not-allowed border border-gray-300 focus:border-gray-400 dark:border-gray-700 dark:focus:border-gray-600"
                      />
                      <div className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                        {t('email')}
                        <svg
                          className="absolute left-0 top-full h-2 w-full text-gray-800"
                          x="0px"
                          y="0px"
                          viewBox="0 0 255 255"
                        >
                          <polygon
                            className="fill-current"
                            points="0,0 127.5,127.5 255,0"
                          />
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 p-3 shadow-sm dark:border-gray-700">
                  <div className="space-y-0.5">
                    <FormLabel>{t('2FA')}</FormLabel>
                    <FormDescription>{t('2FAlable')}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit">
          {t('btn')}
        </Button>
      </form>
    </Form>
  );
};
export default ProfileForm;
