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
import { getCompanyById } from '@/data/company';
import { EditCompanySchema } from '@/schemas';
import { useState, useTransition, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateCompany } from '@/actions/company';
import { Switch } from '@/components/ui/switch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/utils/helpers';
import { showToast } from '@/components/ui/toast';
import { Loader } from '@/components/ui/loader';

interface EditCompanyModalProps {
  id: string;
  onClose: () => void;
  onCompanyUpdate: (id: string, company: { company_name: string }) => void;
}

export const EditCompanyModal = ({
  id,
  onClose,
  onCompanyUpdate,
}: EditCompanyModalProps) => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [company, setCompany] = useState<{ company_name: string } | null>(null);

  const form = useForm<z.infer<typeof EditCompanySchema>>({
    resolver: zodResolver(EditCompanySchema),
    defaultValues: {
      company_name: '',
      is_trial: false,
      expire_date: null,
    },
  });

  useEffect(() => {
    const fetchCompany = async () => {
      const fetchedCompany = await getCompanyById(id);
      setCompany(fetchedCompany);
      form.reset({
        company_name: fetchedCompany.company_name,
        is_trial: fetchedCompany.is_trial,
        expire_date: fetchedCompany.expire_date,
      });
    };
    fetchCompany();
  }, [id, form]);
  const isTrial = useWatch({
    control: form.control,
    name: 'is_trial',
  });
  // Form submition
  const onSubmit = async (values: z.infer<typeof EditCompanySchema>) => {
    setError('');
    setSuccess('');
    console.log(values);
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

  return (
    <>
      {company ? (
        <DialogContent className="fixed data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[90vh] w-[95vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-4 shadow-xl focus:outline-none z-50 overflow-y-auto sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <DialogTitle className="text-lg font-medium mb-0 sm:text-xl">
            Edit company
          </DialogTitle>
          <DialogDescription className="text-sm mb-2 text-gray-500 dark:text-gray-300">
            Edit company details of {company.company_name}
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
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Company name"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_trial"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 dark:border-gray-600 p-3 shadow-sm">
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
                    name="expire_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 dark:border-gray-600 p-3 shadow-sm">
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
                              'w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white',
                              'focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white',
                              'aria-selected:bg-black dark:aria-selected:bg-white aria-selected:text-white dark:aria-selected:text-black',
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
                <div className="mt-6 flex flex-col sm:flex-row-reverse sm:justify-center justify-center gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    isLoading={isPending}
                    className="w-full sm:w-auto px-7 border border-transparent"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={onClose}
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto px-7 border border-gray-300 dark:border-gray-600"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent className="fixed data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[90vh] w-[95vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-4 shadow-xl focus:outline-none z-50 overflow-y-auto sm:w-[90vw] sm:p-6 md:w-[85vw] lg:w-[80vw] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <DialogTitle className="text-lg font-medium mb-2 sm:text-xl">
            Edit company
          </DialogTitle>
          <DialogDescription className="text-sm mb-4 text-gray-500 dark:text-gray-300 flex space-x-2">
            <Loader className="w-5 h-5" />
            <span>Fetching company details</span>
          </DialogDescription>
        </DialogContent>
      )}
    </>
  );
};
