import 'react-datepicker/dist/react-datepicker.css';

import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@prisma/client';
import { UserRole } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes'; // Add this import
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
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
import { Loader } from '@/components/ui/loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { showToast } from '@/components/ui/toast';
import { updateUser } from '@/data/user';
import { EditUserSchema } from '@/schemas';

interface UserData {
  id: string;
  name: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  isTwoFactorEnabled: boolean;
  emailVerified: Date | null;
  createdBy: string | null;
  image: string | '';
  isDeleted: boolean;
}

interface EditUserModalProps {
  userData: UserData;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

const EditUserModal = ({ userData, onClose, onUserUpdated }: EditUserModalProps) => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const { theme } = useTheme();
  const t = useTranslations('UsersPage.EditUser');
  const g = useTranslations('General');

  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: userData.name ?? '',
      role: userData.role ?? 'USER',
      isActive: userData.isActive,
      isTwoFactorEnabled: userData.isTwoFactorEnabled,
    },
  });

  // Form submition
  const onSubmit = async (values: z.infer<typeof EditUserSchema>) => {
    setError('');
    setSuccess('');
    setIsPending(true);

    try {
      const data = await updateUser(values, userData.id);
      if (data.success) {
        showToast({
          message: t('success'),
          type: 'success',
        });
        onUserUpdated(data.user);
        onClose();
        form.reset();
      } else {
        setError(data.message || t('error'));
      }
    } catch (err) {
      setError(t('error'));
    }
    setIsPending(false);
  };

  return userData ? (
    <DialogContent
      className={`fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg p-4 shadow-xl focus:outline-none data-[state=open]:animate-contentShow sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw] ${theme === 'dark' ? ' text-white' : 'bg-white text-gray-900'}`}
    >
      <DialogTitle className="mb-2 text-lg font-medium sm:text-xl">
        {t('heading')}
      </DialogTitle>
      <DialogDescription
        className={`mb-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
      >
        {t('title')}
        {userData.email}
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
                      placeholder="User name"
                      className={`w-full border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                >
                  <div className="space-y-0.5">
                    <FormLabel> {t('label')}</FormLabel>
                    <FormDescription> {t('labelTxt')}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
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
                  <FormLabel> {g('role')}</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}> {g('admin')}</SelectItem>
                      <SelectItem value={UserRole.USER}> {g('user')}</SelectItem>
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
    </DialogContent>
  ) : (
    <DialogContent
      className={`fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-[500px] translate-x-1/2 translate-y-1/2 overflow-y-auto rounded-lg p-4 shadow-xl focus:outline-none data-[state=open]:animate-contentShow sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
    >
      <DialogTitle className="mb-2 text-lg font-medium sm:text-xl">
        {t('heading')}
      </DialogTitle>
      <DialogDescription
        className={`mb-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} flex space-x-2`}
      >
        <Loader />
        <span>{t('fetching')}</span>
      </DialogDescription>
    </DialogContent>
  );
};
export default EditUserModal;
