'use server';
import ProductList from '@/components/productList';
import { stripe } from '@/utils/stripe';
import { Suspense } from 'react';
import { UserTableSkeleton } from '@/components/ui/skeletons';
import { auth } from '@/auth';
import { getSubscription } from '@/data/subscription';
const SubscriptionPage = async () => {
  const session = await auth();
  //console.log('🚀 ~ file: page.tsx:14 ~ SubscriptionPage ~ products:', products);
  const subscription = await getSubscription(session.user.cid);
  console.log('🚀 ~ SubscriptionPage ~ subscription:', subscription);

  const products = await stripe.products.list({
    active: true,
  });

  // Match products with their prices
  const productWithPrices = await Promise.all(
    products.data.map(async (product) => {
      console.log('🚀 ~ productWithPrices ~ productId:', product.id);
      const prices = await stripe.prices.list({
        active: true,
        product: product.id,
      });
      console.log('🚀 ~ file: page.tsx:20 ~ SubscriptionPage ~ prices:', prices);
      // const productPrices = prices.data.filter((price) => price.product === product.id);
      return { ...product, prices: prices.data };
    }),
  );

  return (
    <div className="m-auto w-fit flex flex-col justify-center">
      <Suspense key={products} fallback={<UserTableSkeleton />}>
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
