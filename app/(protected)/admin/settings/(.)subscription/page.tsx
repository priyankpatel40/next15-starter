'use server';
import ProductList from '@/components/productList';
import { stripe } from '@/utils/stripe';
import { Suspense } from 'react';
import { ProductListSkeleton } from '@/components/ui/skeletons';
import { auth } from '@/auth';
import { getSubscription } from '@/data/subscription';
const SubscriptionPage = async () => {
  const session = await auth();
  console.log('🚀 ~ file: page.tsx:10 ~ SubscriptionPage ~ session:', session);
  const subscription = await getSubscription(session.user.cid);
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

  return (
    <div className="m-auto flex flex-col justify-center p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mr-4">Your Subscription</h2>
        {!session.user.company.is_trial ? (
          <div className="p-2 bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white rounded-md">
            {(() => {
              const expireDate = new Date(session.user.company.expire_date);
              const today = new Date();
              const remainingDays = Math.ceil(
                (expireDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
              );
              return `You are on trial currently. Trial ends in ${remainingDays} days.`;
            })()}
          </div>
        ) : (
          <div className="p-2 bg-green-200 dark:bg-green-600 text-green-800 dark:text-white rounded-md">
            You are already subscribed.
          </div>
        )}
      </div>
      <Suspense key={products.data.length} fallback={<ProductListSkeleton />}>
        <ProductList
          currentSession={session}
          products={productWithPrices}
          subscription={subscription}
        />
      </Suspense>
    </div>
  );
};

export default SubscriptionPage;
