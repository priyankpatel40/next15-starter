'use server';
import { deleteSubscription, updateSubscriptionData } from '@/data/subscription';
import { SubscriptionSchema } from '@/schemas';
import { stripe } from '@/utils/stripe';
import { z } from 'zod';

export const createSession = async (values: z.infer<typeof SubscriptionSchema>) => {
  const validatedFields = SubscriptionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  let result = null;
  const { cid, userId, priceId, productId, email, quantity } = validatedFields.data;
  console.log(
    '🚀 ~ file: subscribe.ts:12 ~ createSession ~ validatedFields.data:',
    validatedFields.data,
  );
  const baseurl = process.env.NEXT_PUBLIC_APP_URL;

  if (!priceId) {
    throw new Error('Price ID is required');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'subscription',
      success_url: `${baseurl}/admin/settings/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseurl}/admin/settings/`,
      metadata: {
        userId: userId,
        cid: cid,
        productId: productId,
        priceId: priceId,
        quantity: quantity,
      },
    });
    return { success: true, url: session.url };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle unknown error type
    console.log('Error in creating the subscription:', errorMessage);
    return { error: true };
  }
};
export const updateStripeSubscription = async (
  values: z.infer<typeof SubscriptionSchema>,
  subscriptionId: string,
) => {
  const validatedFields = SubscriptionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  let result = null;
  const { cid, userId, priceId, productId, email, quantity } = validatedFields.data;
  console.log(
    '🚀 ~ file: subscribe.ts:12 ~ createSession ~ validatedFields.data:',
    validatedFields.data,
  );
  try {
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updatedSubscription = await stripe.subscriptions.update(
      currentSubscription.id,
      {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price: priceId,
            quantity: quantity,
          },
        ],
        proration_behavior: 'create_prorations',
      },
    );
    if (updatedSubscription) {
      try {
        const update = await updateSubscriptionData({
          userId: userId,
          subscriptionId: currentSubscription.id,
          status: updatedSubscription.status,
          priceId: priceId,
          productId: productId,
          quantity: quantity,
        });

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle unknown error type
        console.log('Error in updating the subscription:', errorMessage);
        return { error: true };
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle unknown error type
    console.log('Error in updating the subscription:', errorMessage);
    return { error: true };
  }
};
export const cancelStripeSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    if (subscription) {
      try {
        const update = await deleteSubscription({
          subscriptionId: subscription.id,
          status: subscription.status,
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle unknown error type
        console.log('Error in updating the subscription data:', errorMessage);
        return { error: true };
      }
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle unknown error type
    console.log('Error in cancelling the subscription:', errorMessage);
    return { error: true };
  }
};
