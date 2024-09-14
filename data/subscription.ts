import { db } from '@/lib/db';

export const createSubscription = async ({
  userId,
  subscriptionId,
  cid,
  status,
  productId,
  priceId,
  quantity,
}: {
  userId: string;
  subscriptionId: string;
  cid: string;
  status: string;
  productId: string;
  priceId: string;
  quantity: number;
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
        quantity: quantity,
      },
    });
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
    console.log('🚀 ~ result:', result);

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
}: {
  userId?: string;
  subscriptionId: string;
  status: string;
  productId: string;
  priceId: string;
  quantity: number;
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
  status: string;
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
        is_active: is_active || true,
        updated_at: new Date(),
      },
    });
    return 'Subscription updated successfully';
  } catch (e) {
    console.error('Error updating subscription:', e);
    //throw new Error('Failed to update subscription');
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
