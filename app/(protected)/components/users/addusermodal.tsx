import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@prisma/client';
import { UserRole } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

import { addUser } from '@/actions/adduser';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showToast } from '@/components/ui/toast';
import { CreateUserSchema } from '@/schemas';

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export default function AddUserModal({ onClose, onUserAdded }: AddUserModalProps) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const t = useTranslations('UsersPage.AddUserModal');
  const g = useTranslations('General');

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: UserRole.USER || UserRole.ADMIN,
    },
  });
  // Form submition
  const onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    setError('');
    setSuccess('');
    setIsPending(true);

    try {
      const data = await addUser(values);
      if (data.success) {
        showToast({
          message: data.success,
          type: 'success',
        });
        onUserAdded(data.user as unknown as User);
        form.reset();
        onClose();
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(t('error'));
    }
    setIsPending(false);
  };
  return (
    <>
      <DialogTitle className="mb-2 text-lg font-medium sm:text-xl">
        {t('btn')}
      </DialogTitle>
      <DialogDescription className="mb-4 text-sm text-gray-500">
        {t('description')}
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {g('name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                      className="w-full"
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
                      className="w-full"
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
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{g('role')}</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>{g('admin')}</SelectItem>
                      <SelectItem value={UserRole.USER}>{g('user')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-2">
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row-reverse sm:justify-center">
              <Button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="w-full px-7 sm:w-auto"
              >
                {t('btn')}
              </Button>
              <Button
                onClick={onClose}
                type="button"
                variant="outline"
                className="w-full px-7 sm:w-auto"
              >
                {t('close')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
