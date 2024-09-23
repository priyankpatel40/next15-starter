import { CheckCircledIcon, Cross2Icon } from '@radix-ui/react-icons';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import type Stripe from 'stripe';

import CancelSubscription from '@/app/(protected)/components/cancelSubscription';
import { auth } from '@/auth';
import ProductList from '@/components/productList';
import { ProductListSkeleton } from '@/components/ui/skeletons';
import { getSubscription } from '@/data/subscription';
import logger from '@/lib/logger';
import { formatDate } from '@/utils/helpers'; // Assuming this import is needed for formatDate
import { stripe } from '@/utils/stripe';

export const metadata: Metadata = {
  title: 'Subscription',
};

// Define the Subscription type
interface Subscription {
  id?: string;
  cid?: string;
  userId?: string;
  stripeSubscriptionId?: string;
  productId?: string;
  priceId?: string;
  quantity?: number;
  status?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
  isActive?: boolean;
  interval?: string | null;
  subscriptionObj: string | '';
}

const SubscriptionPage = async () => {
  let subscriptionData;
  const session = await auth();
  const t = await getTranslations('SubscriptionPage');
  logger.info('🚀 ~ file: page.tsx:10 ~ SubscriptionPage ~ session:', session);
  const subscription = (await getSubscription(session.user.cid)) as Subscription;
  if (subscription !== null) {
    subscriptionData = {
      ...subscription,
      ...JSON.parse(subscription.subscriptionObj),
    };
  }
  // logger.info(
  //   '🚀 ~ file: page.tsx:35 ~ SubscriptionPage ~ subscription:',
  //   subscriptionData,
  // );

  const products = await stripe.products.list({
    active: true,
  });

  // Match products with their prices
  const productWithPrices: Array<Stripe.Product & { prices: Stripe.Price[] }> =
    await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          active: true,
          product: product.id,
        });
        return {
          ...product,
          prices: prices.data,
        };
      }),
    );

  return (
    <div className="m-auto flex flex-col justify-center ">
      <div className="mb-6 flex items-center justify-center">
        <h2 className="mr-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
          {t('subscription')}
        </h2>
        {session.user.company.isTrial && (
          <div className="flex items-center rounded-md bg-yellow-300 p-2 text-black shadow-lg transition-transform hover:scale-105 dark:bg-yellow-700 dark:text-white">
            <svg className="mr-2 size-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18C5.58 18 2 14.42 2 10S5.58 2 10 2s8 3.58 8 8-3.58 8-8 8z" />
              <path d="M10 5a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1zm0 10a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <div className="mt-1">
              {(() => {
                const expireDate = new Date(session.user.company.expireDate);
                const today = new Date();
                const remainingDays = Math.ceil(
                  (expireDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
                );
                return ` ${t('onTrial')} ${remainingDays} ${t('days')}.`;
              })()}
            </div>
          </div>
        )}

        {!session.user.company.isTrial &&
          subscription &&
          subscription.stripeSubscriptionId !== null &&
          subscription.status !== 'canceled' && (
            <div className="flex items-center rounded-md bg-green-300 p-2 text-black shadow-lg transition-transform hover:scale-105 dark:bg-green-700 dark:text-white">
              <CheckCircledIcon className="size-8 pr-2" />
              <div className="mt-1"> {t('subscribed')}</div>
            </div>
          )}
        {!session.user.company.isTrial &&
          subscription &&
          subscription.status === 'canceled' && (
            <div className="flex items-center rounded-md bg-red-200 p-2 text-red-900 shadow-lg transition-transform hover:scale-105 dark:bg-red-700 dark:text-white">
              <Cross2Icon className="size-8 pr-2" />
              <div className="mt-1"> {t('cancelled')}</div>
            </div>
          )}
      </div>

      {!session.user.company.isTrial &&
        subscription &&
        subscription.stripeSubscriptionId !== null &&
        subscription.status !== 'canceled' && (
          <div className="my-4">
            <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
              {' '}
              {/* Added background color for light and dark themes */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {' '}
                {/* Adjusted text color for dark theme */}
                {t('current')}
              </h3>
              <div className="mt-2 rounded-md border-l-4 border-gray-500 bg-gray-100 text-gray-700 dark:border-gray-400 dark:bg-gray-700 dark:text-gray-300">
                {' '}
                {/* Adjusted background and text colors */}
                <div className="p-3 pb-1">
                  <strong> {t('period')}</strong>{' '}
                  {formatDate(
                    new Date(subscriptionData.current_period_start * 1000),
                    'MMM dd, yyyy',
                  )}{' '}
                  to{' '}
                  {formatDate(
                    new Date(subscriptionData.current_period_end * 1000),
                    'MMM dd, yyyy',
                  )}
                </div>
                <div className="p-3 pt-1">
                  <strong> {t('license')}</strong> {subscriptionData.quantity}
                </div>
              </div>
            </div>
          </div>
        )}

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList
          currentSession={session}
          products={productWithPrices}
          subscription={subscription}
        />
      </Suspense>

      <Suspense key={subscription?.id} fallback={<ProductListSkeleton />}>
        {subscription &&
          subscription.stripeSubscriptionId &&
          subscription.status !== 'canceled' && (
            <div className="flex items-center justify-center py-10">
              <CancelSubscription subscriptionId={subscription.stripeSubscriptionId} />
            </div>
          )}
      </Suspense>
    </div>
  );
};

export default SubscriptionPage;
