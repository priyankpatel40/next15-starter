'use client';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { cancelStripeSubscription } from '@/actions/subscribe';
import { useRouter } from 'next/navigation';

export const CancelSubscription = ({ subscriptionId }: { subscriptionId: string }) => {
  const form = useForm();
  const router = useRouter();
  const onSubmit = async () => {
    const result = await cancelStripeSubscription(subscriptionId);
    if (result.success) {
      showToast({
        message: 'Your cancellation request has been processed.',
        type: 'info',
      });
      router.refresh();
    } else {
      showToast({
        message: 'Unable to process your cancellation request. Please try again!',
        type: 'error',
      });
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <h2 className="font-bold">Don&apos;t want to continue?</h2>
            <Button
              variant="link"
              className="p-2 ml-4 hover:underline text-gray-500 text-sm"
            >
              Cancel subscription
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
