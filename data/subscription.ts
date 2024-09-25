import { db } from '@/lib/db';

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
        cid,
      },
    });
    if (existingSubscription) {
      await db.subscription.update({
        where: {
          cid,
        },
        data: {
          stripeSubscriptionId: subscriptionId,
          status,
          updatedAt: new Date(),
          userId,
          productId,
          priceId,
          quantity,
          subscriptionObj: data,
        },
      });
    } else {
      await db.subscription.create({
        data: {
          cid,
          stripeSubscriptionId: subscriptionId,
          status,
          userId,
          productId,
          priceId,
          quantity,
          subscriptionObj: data,
        },
      });
    }
    await db.company.update({
      where: {
        id: cid,
      },
      data: {
        isActive: true,
        isTrial: false,
        updatedAt: new Date(),
      },
    });

    return 'Subscription created successfully';
  } catch (e) {
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
  data?: string;
}) => {
  try {
    await db.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        status,
        updatedAt: new Date(),
        userId,
        productId,
        priceId,
        quantity,
        subscriptionObj: data,
      },
    });

    return 'Subscription updated successfully';
  } catch (e) {
    throw new Error('Failed to update subscription');
  }
  // Removed unreachable return statement
};
export const deleteSubscription = async ({
  subscriptionId,
  status,
  isActive,
}: {
  subscriptionId: string;
  status?: string;
  isActive?: boolean;
}) => {
  try {
    await db.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        stripeSubscriptionId: subscriptionId,
        status,
        isActive: isActive || false,
        updatedAt: new Date(),
      },
    });

    return { success: true, message: 'Subscription updated successfully' };
  } catch (e) {
    // throw new Error('Failed to update subscription');
    return { error: true, message: 'Failed to update subscription details' };
  }
};

export const getSubscription = async (cid: string) => {
  try {
    const result = await db.subscription.findFirst({
      where: { cid },
    });
    if (result) {
      return result;
    }
    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle unknown error type

    return { error: true, message: errorMessage };
  }
};
