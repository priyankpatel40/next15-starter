'use server';
import ProductList from '@/components/productList';
import { stripe } from '@/utils/stripe';
import { Suspense } from 'react';
import { ProductListSkeleton } from '@/components/ui/skeletons';
import { auth } from '@/auth';
import { getSubscription } from '@/data/subscription';
const SubscriptionPage = async () => {
  const session = await auth();
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
    <div className="m-auto  flex flex-col justify-center">
      <h2 className="mx:auto items-center text-center p-4">Your Subscription</h2>
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
