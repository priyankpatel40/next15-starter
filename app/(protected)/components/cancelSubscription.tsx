'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { cancelStripeSubscription } from '@/actions/subscribe';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; // Import Dialog components
import { Form } from '@/components/ui/form';
import { showToast } from '@/components/ui/toast';

const CancelSubscription = ({ subscriptionId }: { subscriptionId: string }) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('SubscriptionPage.CancelSubscription');

  const form = useForm();
  const router = useRouter();
  const onSubmit = async () => {
    startTransition(async () => {
      const result = await cancelStripeSubscription(subscriptionId);
      if (result.success) {
        showToast({
          message: 'Your cancellation request has been processed.',
          type: 'warning',
        });
        router.refresh();
      } else {
        showToast({
          message: 'Unable to process your cancellation request. Please try again!',
          type: 'error',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="font-bold">{t('title')}</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="link"
                className="ml-4 p-2 text-sm text-gray-500 hover:underline"
              >
                {t('cancel')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('confirm')}</DialogTitle>
                <DialogDescription className="rounded-md bg-gray-100 p-4 font-semibold text-gray-500">
                  {t('text')}
                </DialogDescription>
                <DialogDescription className="rounded-md bg-gray-100 p-4 font-semibold text-gray-500">
                  {t('text2')}
                </DialogDescription>
                <DialogDescription className="rounded-md bg-gray-100 p-4 font-semibold text-gray-500">
                  {t('text3')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button" // Change to type="button" to prevent default form submission
                  onClick={form.handleSubmit(onSubmit)} // Call the onSubmit function directly
                  disabled={isPending}
                  isLoading={isPending}
                  className="p-4"
                >
                  {t('btnConfirm')}
                </Button>
                <DialogClose asChild>
                  <Button variant="link">{t('btnCancel')}</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </Form>
  );
};
export default CancelSubscription;
