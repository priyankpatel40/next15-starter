import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateUserSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { addUser } from '@/actions/adduser';
import { User, UserRole } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showToast } from '@/components/ui/toast';

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export default function AddUserModal({ onClose, onUserAdded }: AddUserModalProps) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean>(false);

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
    console.log(values);
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
    } catch (error) {
      console.error('Error updating user:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    setIsPending(false);
  };
  return (
    <>
      <DialogTitle className="text-lg font-medium mb-2 sm:text-xl">
        Add new user
      </DialogTitle>
      <DialogDescription className="text-sm mb-4 text-gray-500">
        Create a new user in your company. Once added, they will receive an account
        verification email.
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-6">
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Role</FormLabel>
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
                Add User
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
    </>
  );
}
