import ProductList from '@/components/productList';
import { stripe } from '@/utils/stripe';
import { Suspense } from 'react';
import { ProductListSkeleton } from '@/components/ui/skeletons';
import { auth } from '@/auth';
import { getSubscription } from '@/data/subscription';
import { CancelSubscription } from '@/app/(protected)/components/cancelSubscription';
import { Metadata } from 'next';
import { formatDate } from '@/utils/helpers'; // Assuming this import is needed for formatDate
import { CheckCircledIcon, Cross2Icon } from '@radix-ui/react-icons';
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
  created_at?: Date;
  updated_at?: Date;
  expires_at?: Date;
  is_active?: boolean;
  interval?: string | null;
  subscriptionObj: string | '';
}

const SubscriptionPage = async () => {
  let subscriptionData = {};
  const session = await auth();
  // console.log('🚀 ~ file: page.tsx:10 ~ SubscriptionPage ~ session:', session);
  const subscription = (await getSubscription(session.user.cid)) as Subscription;
  if (subscription !== null) {
    subscriptionData = {
      ...subscription,
      ...JSON.parse(subscription.subscriptionObj),
    };
  }
  console.log(
    '🚀 ~ file: page.tsx:35 ~ SubscriptionPage ~ subscription:',
    subscriptionData,
  );

  const products = await stripe.products.list({
    active: true,
  });

  // Match products with their prices
  const productWithPrices = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({
        active: true,
        product: product.id,
      });
      return { ...product, prices: prices.data };
    }),
  );
  console.log('abc', session.user.company.is_trial);

  return (
    <div className="m-auto flex flex-col justify-center ">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mr-4">
          Your Subscription
        </h2>
        {session.user.company.is_trial && (
          <div className="flex items-center p-2 bg-yellow-300 dark:bg-yellow-700 text-black dark:text-white rounded-md shadow-lg transition-transform transform hover:scale-105">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18C5.58 18 2 14.42 2 10S5.58 2 10 2s8 3.58 8 8-3.58 8-8 8z" />
              <path d="M10 5a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1zm0 10a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <div className="mt-1">
              {(() => {
                const expireDate = new Date(session.user.company.expire_date);
                const today = new Date();
                const remainingDays = Math.ceil(
                  (expireDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
                );
                return `On Trial - ends in ${remainingDays} days.`;
              })()}
            </div>
          </div>
        )}

        {!session.user.company.is_trial &&
          subscription &&
          subscription.stripeSubscriptionId !== null &&
          subscription.status !== 'canceled' && (
            <div className="flex items-center p-2 bg-green-300 dark:bg-green-700 text-black dark:text-white rounded-md shadow-lg transition-transform transform hover:scale-105">
              <CheckCircledIcon className="h-8 w-8 pr-2" />
              <div className="mt-1">Subscribed</div>
            </div>
          )}
        {!session.user.company.is_trial &&
          subscription &&
          subscription.status === 'canceled' && (
            <div className="flex items-center p-2 bg-red-200 dark:bg-red-700 text-red-900 dark:text-white rounded-md shadow-lg transition-transform transform hover:scale-105">
              <Cross2Icon className="h-8 w-8 pr-2" />
              <div className="mt-1">Cancelled</div>
            </div>
          )}
      </div>

      {!session.user.company.is_trial &&
        subscription &&
        subscription.stripeSubscriptionId !== null &&
        subscription.status !== 'canceled' && (
          <div className="my-4">
            <div className="shadow-md rounded-lg p-4 bg-white dark:bg-gray-800"> {/* Added background color for light and dark themes */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200"> {/* Adjusted text color for dark theme */}
                Current Subscription Details
              </h3>
              <div className="mt-2 bg-gray-100 dark:bg-gray-700 border-l-4 border-gray-500 dark:border-gray-400 text-gray-700 dark:text-gray-300 rounded-md"> {/* Adjusted background and text colors */}
                <div className="p-3 pb-1">
                  <strong>Current Period:</strong>{' '}
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
                  <strong>License:</strong> {subscriptionData.quantity}
                </div>
              </div>
            </div>
          </div>
        )}

      <Suspense key={products.data.length} fallback={<ProductListSkeleton />}>
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
            <div className="py-10 items-center justify-center flex">
              <CancelSubscription subscriptionId={subscription.stripeSubscriptionId} />
            </div>
          )}
      </Suspense>
    </div>
  );
};

export default SubscriptionPage;
