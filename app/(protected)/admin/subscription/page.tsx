'use server';
import ProductList from '@/components/productList';
import { stripe } from '@/utils/stripe';
import { Suspense } from 'react';
import { UserTableSkeleton } from '@/components/ui/skeletons';
import { auth } from '@/auth';
const SubscriptionPage = async () => {
  const session = await auth();
  const products = await stripe.products.list({
    active: true,
  });
  //console.log('🚀 ~ file: page.tsx:14 ~ SubscriptionPage ~ products:', products);

  const prices = await stripe.prices.list({
    active: true,
  });
  console.log('🚀 ~ file: page.tsx:20 ~ SubscriptionPage ~ prices:', prices);

  // Match products with their prices
  const productWithPrices = products.data.map((product) => {
    const productPrices = prices.data.filter((price) => price.product === product.id);
    return { ...product, prices: productPrices };
  });
  console.log(
    '🚀 ~ file: page.tsx:27 ~ productWithPrices ~ productWithPrices:',
    productWithPrices,
  );

  return (
    <div className="m-auto w-fit flex flex-col justify-center">
      <Suspense key={products} fallback={<UserTableSkeleton />}>
        <ProductList session={session} products={productWithPrices} />
      </Suspense>
    </div>
  );
};

export default SubscriptionPage;
