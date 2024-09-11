'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useEffect, useMemo, useState } from 'react'; // Import useState
import * as Tabs from '@radix-ui/react-tabs'; // Import Tabs
import { Input } from '@/components/ui/input';
import { stripe } from '@/utils/stripe';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: string;
    interval_count: number;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  prices: Price[];
}

interface PricingTabsProps {
  products: Product[];
  session: any;
}

const ProductList: React.FC<PricingTabsProps> = ({ products, session }) => {
  const router = useRouter();
  console.log('🚀 ~ file: productList.tsx:19 ~ ProductList ~ products:', products);
  const [tab, setTab] = useState(''); // State for tab selection
  const pricingIntervals = useMemo(() => {
    const intervals = new Set<string>();
    products.forEach((product) => {
      product.prices.forEach((price) => {
        intervals.add(price.recurring.interval);
      });
    });
    const intervalsArray = Array.from(intervals).sort(); // Convert Set to Array
    setTab(intervalsArray[0]); // Access the first element of the array
    return intervalsArray; // Return the array
  }, [products]);

  const form = useForm();

  const onSubmit = async (formData: Record<string, any>) => {
    console.log('🚀 ~ file: productList.tsx:54 ~ onSubmit ~ formData:', formData);
    const { priceId, cid, userId, productId } = formData; // Destructure form values
    const baseurl = process.env.NEXT_PUBLIC_APP_URL;

    if (!priceId) {
      throw new Error('Price ID is required');
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseurl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseurl}/subscription/cancel`,
      });
      router.push(session.url);
    } catch (error: any) {
      console.error(error.message);
      throw new Error('Failed to create a checkout session');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="text-2xl p-4 text-center font-bold">Choose your plan</h2>
        {/* Tabs for Monthly and Yearly */}
        <Tabs.Root defaultValue={pricingIntervals[0]} className="">
          <Tabs.List
            className="flex w-1/2 border-b justify-center items-center  border-gray-300 dark:border-gray-600 mb-4" // Adjusted border color and added margin
            aria-label="Select Plan"
          >
            {pricingIntervals.map((interval) => (
              <Tabs.Trigger
                key={interval}
                value={interval}
                onClick={() => setTab(interval)}
                className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors duration-200 
                  ${tab === interval ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`} // Enhanced hover and active styles
              >
                Per {interval.charAt(0).toUpperCase() + interval.slice(1)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {pricingIntervals.map((interval) => (
            <Tabs.Content key={interval} value={interval} className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {products.map((product) => {
                  const price = product.prices.find(
                    (price) => price.recurring.interval === interval,
                  );

                  if (!price) return null;

                  return (
                    <div
                      key={product.id}
                      className="p-6 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200" // Enhanced padding, border color, and shadow effect
                    >
                      <Input
                        type="hidden"
                        value={session.user.cid}
                        {...form.register('cid')} // Updated to use spread operator
                      />
                      <Input
                        type="hidden"
                        value={session.user.id}
                        {...form.register('userId')} // Updated to use spread operator
                      />
                      <Input
                        type="hidden"
                        value={product.id}
                        {...form.register('productId')} // Updated to use spread operator
                      />
                      <Input
                        type="hidden"
                        value={price.id}
                        {...form.register('priceId')} // Updated to use spread operator
                      />
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>{' '}
                      <p className="text-gray-600">{product.description}</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {(price.unit_amount / 100).toFixed(2)}{' '}
                        {price.currency.toUpperCase()} / {interval}
                      </p>
                      <Button className="mt-4 px-6 py-2" type="submit">
                        {' '}
                        Subscribe
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </form>
    </Form>
  );
};

export default ProductList;
