'use client';

import { useState, useTransition, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import * as z from 'zod';

import { SettingsSchema } from '@/schemas';
import { settings } from '@/actions/settings';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { showToast } from '@/components/ui/toast';

interface ClientProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
}

export function ProfileForm({ user }: ClientProfileFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof SettingsSchema>) => {
      startTransition(() => {
        settings(values)
          .then((data) => {
            if (data.error) {
              setError(data.error);
            }
            if (data.success) {
              update();

              showToast({
                message: data.success,
                type: 'success',
              });
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
        <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="John Doe"
                  disabled={isPending}
                  className="border border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!user.isOAuth && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled={true}
                        className="border border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600 cursor-not-allowed"
                      />
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Email cannot be changed
                        <svg
                          className="absolute text-gray-800 h-2 w-full left-0 top-full"
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
                <FormItem className="flex border border-gray-300 dark:border-gray-700 flex-row items-center justify-between rounded-lg p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
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
          Save Profile
        </Button>
      </form>
    </Form>
  );
}
