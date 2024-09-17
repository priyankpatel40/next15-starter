import { db } from '@/lib/db';
import { stripe } from '@/utils/stripe';

export const createSubscription = async ({
  userId,
  subscriptionId,
  cid,
  status,
  productId,
  priceId,
  quantity,
  data,
}: {
  userId: string;
  subscriptionId: string;
  cid: string;
  status: string;
  productId: string;
  priceId: string;
  quantity: number;
  data: string;
}) => {
  try {
    const existingSubscription = await db.subscription.findFirst({
      where: {
        cid: cid,
      },
    });
    if (existingSubscription) {
      const result = await db.subscription.update({
        where: {
          cid: cid,
        },
        data: {
          stripeSubscriptionId: subscriptionId,
          status: status,
          updated_at: new Date(),
          userId: userId,
          productId: productId,
          priceId: priceId,
          quantity: quantity,
          subscriptionObj: data,
        },
      });
    } else {
      const result = await db.subscription.create({
        data: {
          cid: cid,
          stripeSubscriptionId: subscriptionId,
          status: status,
          userId: userId,
          productId: productId,
          priceId: priceId,
          quantity: quantity,
          subscriptionObj: data,
        },
      });
    }
    await db.company.update({
      where: {
        id: cid,
      },
      data: {
        is_active: true,
        is_trial: false,
        updated_at: new Date(),
      },
    });

    return 'Subscription created successfully';
  } catch (e) {
    console.error('Error updating subscription:', e);
    throw new Error('Failed to update subscription');
  }
};
export const updateSubscriptionData = async ({
  userId,
  subscriptionId,
  status,
  productId,
  priceId,
  quantity,
  data,
}: {
  userId?: string;
  subscriptionId: string;
  status: string;
  productId: string;
  priceId: string;
  quantity: number;
  data: string;
}) => {
  try {
    await db.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        status: status,
        updated_at: new Date(),
        userId: userId,
        productId: productId,
        priceId: priceId,
        quantity: quantity,
        subscriptionObj: data,
      },
    });

    return 'Subscription updated successfully';
  } catch (e) {
    console.error('Error updating subscription:', e);
    throw new Error('Failed to update subscription');
  }
  // Removed unreachable return statement
};
export const deleteSubscription = async ({
  subscriptionId,
  status,
  is_active,
}: {
  subscriptionId: string;
  status?: string;
  is_active?: boolean;
}) => {
  try {
    await db.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        stripeSubscriptionId: subscriptionId,
        status: status,
        is_active: is_active || false,
        updated_at: new Date(),
      },
    });

    return { success: true, message: 'Subscription updated successfully' };
  } catch (e) {
    console.error('Error updating subscription:', e);
    //throw new Error('Failed to update subscription');
    return { error: true, message: 'Failed to update subscription details' };
  }
};

export const getSubscription = async (cid: string) => {
  try {
    const result = await db.subscription.findFirst({
      where: { cid: cid },
    });
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle unknown error type
    console.log('Error in updating the subscription:', errorMessage);
    return { error: true, message: errorMessage };
  }
};
