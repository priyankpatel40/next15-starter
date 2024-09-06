'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { ChangePasswordSchema } from '@/schemas';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { changePassword } from '@/actions/change-password';
import { User } from '@prisma/client';
import { showToast } from '@/components/ui/toast';

export function ChangePasswordForm({ user }: { user: User }) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, setIsPending] = useState<boolean>(false);

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
    } catch (error) {
      setError('Something went wrong!');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
      {!user.isOAuth ? (
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                      required
                      className="border border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600"
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                      required
                      className="border border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
              Update Password
            </Button>
          </form>
        </Form>
      ) : (
        <h2>You can&apos;t change your password because you signed up with Oauth</h2>
      )}
    </>
  );
}
