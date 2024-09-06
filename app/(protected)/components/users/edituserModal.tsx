import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { EditUserSchema } from '@/schemas';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import 'react-datepicker/dist/react-datepicker.css';
import { showToast } from '@/components/ui/toast';
import { Loader } from '@/components/ui/loader';
import { updateUser } from '@/data/user';
import { User, UserRole } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from 'next-themes'; // Add this import
import { revalidatePath } from 'next/cache';

interface EditUserModalProps {
  userData: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

export const EditUserModal = ({
  userData,
  isOpen,
  onClose,
  onUserUpdated,
}: EditUserModalProps) => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { theme } = useTheme(); // Add this line

  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      email: userData.email ?? '',
      name: userData.name ?? '',
      role: userData.role,
      is_active: userData.is_active,
      isTwoFactorEnabled: userData.isTwoFactorEnabled,
    },
  });

  const isTrial = useWatch({
    control: form.control,
    name: 'is_active',
  });
  // Form submition
  const onSubmit = async (values: z.infer<typeof EditUserSchema>) => {
    setError('');
    setSuccess('');
    setIsPending(true);
    console.log('Form values:', values);

    try {
      const data = await updateUser(values, userData.id);
      if (data.success) {
        showToast({
          message: 'User updated successfully',
          type: 'success',
        });
        onUserUpdated(data.user);
        onClose();
        form.reset();
      } else {
        setError(data.message || 'An error occurred while updating the user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    setIsPending(false);
  };

  return (
    <>
      {userData ? (
        <DialogContent
          className={`fixed data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[90vh] w-[95vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-4 shadow-xl focus:outline-none z-50 overflow-y-auto sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw] ${theme === 'dark' ? ' text-white' : 'bg-white text-gray-900'}`}
        >
          <DialogTitle className="text-lg font-medium mb-2 sm:text-xl">
            Edit user
          </DialogTitle>
          <DialogDescription
            className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
          >
            Edit user details of {userData.email}
          </DialogDescription>
          <Form {...form}>
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
                        <FormLabel>Is 2FA enabled?</FormLabel>
                        <FormDescription>Enable or disable 2FA for user</FormDescription>
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
                      <FormLabel>Role</FormLabel>
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
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.USER}>User</SelectItem>
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
                <div className="mt-6 flex flex-col sm:flex-row-reverse sm:justify-center justify-center gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    isLoading={isPending}
                    className="w-full sm:w-auto px-7"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={onClose}
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto px-7"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent
          className={`fixed data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[90vh] w-[95vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-4 shadow-xl focus:outline-none z-50 overflow-y-auto sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        >
          <DialogTitle className="text-lg font-medium mb-2 sm:text-xl">
            Edit user
          </DialogTitle>
          <DialogDescription
            className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} flex space-x-2`}
          >
            <Loader />
            <span>Fetching user details</span>
          </DialogDescription>
        </DialogContent>
      )}
    </>
  );
};
