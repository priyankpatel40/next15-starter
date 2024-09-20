import 'react-datepicker/dist/react-datepicker.css';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Company } from '@prisma/client';
import { useEffect, useState, useTransition } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';

import { updateCompany } from '@/actions/company';
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
import { Switch } from '@/components/ui/switch';
import { showToast } from '@/components/ui/toast';
import { getCompanyById } from '@/data/company';
import logger from '@/lib/logger';
import { EditCompanySchema } from '@/schemas';
import { cn } from '@/utils/helpers';

interface EditCompanyModalProps {
  id: string;
  onClose: () => void;
  onCompanyUpdate: (id: string, company: { companyName: string }) => void;
}
const EditCompanyModal = ({ id, onClose, onCompanyUpdate }: EditCompanyModalProps) => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [company, setCompany] = useState<{ companyName: string } | null>(null);

  const form = useForm<z.infer<typeof EditCompanySchema>>({
    resolver: zodResolver(EditCompanySchema),
    defaultValues: {
      companyName: '',
      isTrial: false,
      expireDate: null,
    },
  });

  useEffect(() => {
    const fetchCompany = async () => {
      const fetchedCompany = (await getCompanyById(id)) as Company;
      setCompany(fetchedCompany);
      form.reset({
        companyName: fetchedCompany.companyName,
        isTrial: fetchedCompany.isTrial,
        expireDate: fetchedCompany.expireDate,
      });
    };
    fetchCompany();
  }, [id, form]);
  const isTrial = useWatch({
    control: form.control,
    name: 'isTrial',
  });
  // Form submition
  const onSubmit = async (values: z.infer<typeof EditCompanySchema>) => {
    setError('');
    setSuccess('');
    logger.info(values);
    startTransition(() => {
      updateCompany(values, id).then((data) => {
        if (data.success) {
          showToast({
            message: 'Company updated successfully',
            type: 'success',
          });
          onCompanyUpdate(id, values);
          onClose();
          form.reset();
        } else if (data.error) {
          setError(data.error);
        }
      });
    });
  };

  return company ? (
    <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-4 text-gray-900 shadow-xl focus:outline-none data-[state=open]:animate-contentShow dark:bg-gray-800 dark:text-white sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw]">
      <DialogTitle className="mb-0 text-lg font-medium sm:text-xl">
        Edit company
      </DialogTitle>
      <DialogDescription className="mb-2 text-sm text-gray-500 dark:text-gray-300">
        Edit company details of {company.companyName}
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Company name"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTrial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 p-3 shadow-sm dark:border-gray-600">
                  <div className="space-y-0.5">
                    <FormLabel>Is on trial?</FormLabel>
                    <FormDescription>
                      Enable or disable trial for the company
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isTrial && (
              <FormField
                control={form.control}
                name="expireDate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 p-3 shadow-sm dark:border-gray-600">
                    <div className="space-y-0.5">
                      <FormLabel>Trial ends on</FormLabel>
                      <FormDescription>
                        Select the date when the trial ends
                      </FormDescription>
                    </div>
                    <FormControl>
                      <DatePicker
                        showIcon
                        toggleCalendarOnIconClick
                        selected={field.value}
                        onChange={(date: Date | null) => field.onChange(date)}
                        minDate={new Date()}
                        className={cn(
                          'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
                          'focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:border-white dark:focus:ring-white',
                          'aria-selected:bg-black aria-selected:text-white dark:aria-selected:bg-white dark:aria-selected:text-black',
                        )}
                        calendarClassName="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md"
                        dayClassName={() =>
                          'hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-black dark:aria-selected:bg-white aria-selected:text-white dark:aria-selected:text-black'
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="p-2">
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row-reverse sm:justify-center">
              <Button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="w-full border border-transparent px-7 sm:w-auto"
              >
                Update
              </Button>
              <Button
                onClick={onClose}
                type="button"
                variant="outline"
                className="w-full border border-gray-300 px-7 dark:border-gray-600 sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  ) : (
    <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-[500px] translate-x-1/2 translate-y-1/2 overflow-y-auto rounded-lg bg-white p-4 text-gray-900 shadow-xl focus:outline-none data-[state=open]:animate-contentShow dark:bg-gray-800 dark:text-white sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw]">
      <DialogTitle className="mb-2 text-lg font-medium sm:text-xl">
        Edit company
      </DialogTitle>
      <DialogDescription className="mb-4 flex space-x-2 text-sm text-gray-500 dark:text-gray-300">
        <Loader />
        <span>Fetching company details</span>
      </DialogDescription>
    </DialogContent>
  );
};
export default EditCompanyModal;
