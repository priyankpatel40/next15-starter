'use client';

import { useRouter } from 'next/navigation';
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
          <h2 className="font-bold">Don&apos;t want to continue?</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="link"
                className="ml-4 p-2 text-sm text-gray-500 hover:underline"
              >
                Cancel subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogDescription className="rounded-md bg-gray-100 p-4 font-semibold text-gray-500">
                  Your subscription will be canceled immediately, and you will lose access
                  to all premium features.
                </DialogDescription>
                <DialogDescription className="rounded-md bg-gray-100 p-4 font-semibold text-gray-500">
                  Please note that canceling your subscription will prevent any future
                  charges, but you will still have access until the end of your billing
                  cycle.
                </DialogDescription>
                <DialogDescription className="rounded-md bg-gray-100 p-4 font-semibold text-gray-500">
                  Are you sure you want to proceed? This action cannot be undone, and you
                  will need to resubscribe to regain access.
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
                  Yes, Cancel
                </Button>
                <DialogClose asChild>
                  <Button variant="link">No, Continue</Button>
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
