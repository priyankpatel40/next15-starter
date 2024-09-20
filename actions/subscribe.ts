'use server';

import type { z } from 'zod';

import { deleteSubscription, updateSubscriptionData } from '@/data/subscription';
import logger from '@/lib/logger';
import { SubscriptionSchema } from '@/schemas';
import { stripe } from '@/utils/stripe';

// Create a session for Stripe Checkout
export const createSession = async (values: z.infer<typeof SubscriptionSchema>) => {
  const validatedFields = SubscriptionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { cid, userId, priceId, productId, email, quantity } = validatedFields.data;
  logger.info(
    '🚀 ~ file: subscribe.ts:12 ~ createSession ~ validatedFields.data:',
    validatedFields.data,
  );

  const baseurl = process.env.NEXT_PUBLIC_APP_URL;
  if (!priceId) {
    return { error: 'Price ID is required' }; // Returning an error instead of throwing one
  }

  try {
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'subscription',
      success_url: `${baseurl}/admin/settings/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseurl}/admin/settings/`,
      metadata: {
        userId,
        cid,
        productId,
        priceId,
        quantity,
      },
    });

    return { success: true, url: session.url };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error && error.message ? error.message : 'Unknown error';
    logger.error('Error in creating the subscription:', errorMessage);
    return { error: errorMessage };
  }
};

// Update a Stripe subscription
export const updateStripeSubscription = async (
  values: z.infer<typeof SubscriptionSchema>,
  subscriptionId: string,
) => {
  const validatedFields = SubscriptionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { userId, priceId, productId, quantity } = validatedFields.data;
  logger.info(
    '🚀 ~ file: subscribe.ts:12 ~ updateStripeSubscription ~ validatedFields.data:',
    validatedFields.data,
  );

  try {
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updatedSubscription = await stripe.subscriptions.update(
      currentSubscription.id,
      {
        items: [
          {
            id: currentSubscription.items.data[0]?.id,
            price: priceId,
            quantity,
          },
        ],
        proration_behavior: 'create_prorations',
      },
    );

    if (updatedSubscription) {
      try {
        await updateSubscriptionData({
          userId,
          subscriptionId: currentSubscription.id,
          status: updatedSubscription.status,
          priceId,
          productId,
          quantity,
        });

        return { success: true };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Error in updating the subscription:', errorMessage);
        return { error: errorMessage };
      }
    }

    return { error: 'Failed to update subscription' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error in updating the subscription:', errorMessage);
    return { error: errorMessage };
  }
};

// Cancel a Stripe subscription
export const cancelStripeSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    if (subscription) {
      try {
        await deleteSubscription({
          subscriptionId: subscription.id,
          status: subscription.status,
        });
        return { success: true };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Error in deleting the subscription data:', errorMessage);
        return { error: errorMessage };
      }
    }

    return { error: 'Failed to cancel subscription' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error in cancelling the subscription:', errorMessage);
    return { error: errorMessage };
  }
};
