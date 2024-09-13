import { db } from '@/lib/db';

export const createSubscription = async ({
  userId,
  subscriptionId,
  cid,
  status,
  productId,
  priceId,
}: {
  userId: string;
  subscriptionId: string;
  cid: string;
  status: string;
  productId: string;
  priceId: string;
}) => {
  try {
    const result = await db.subscription.create({
      data: {
        cid: cid,
        stripeSubscriptionId: subscriptionId,
        status: status,
        userId: userId,
        productId: productId,
        priceId: priceId,
      },
    });
    console.log('🚀 ~ result:', result);

    return 'Subscription updated successfully';
  } catch (e) {
    console.error('Error updating subscription:', e);
    throw new Error('Failed to update subscription');
  }
};
export const updateSubscription = async ({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: string;
}) => {
  try {
    await db.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        stripeSubscriptionId: subscriptionId,
        status: status,
        is_active: false,
        updated_at: new Date(),
      },
    });
    return 'Subscription updated successfully';
  } catch (e) {
    console.error('Error updating subscription:', e);
    throw new Error('Failed to update subscription');
  }
  return 'Failed to update subscription';
};

export const getSubscription = (cid: string) => {
  try {
    const result = db.subscription.findFirst({
      where: { cid: cid },
    });
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

