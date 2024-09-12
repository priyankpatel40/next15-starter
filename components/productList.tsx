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
import { cn } from '@/utils/helpers';
import { areIntervalsOverlapping } from 'date-fns';

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
  currentSession: any;
  subscription: any;
}

const ProductList: React.FC<PricingTabsProps> = ({
  products,
  currentSession,
  subscription,
}) => {
  console.log('🚀 ~ currentSession:', currentSession);
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
    const { priceId, cid, userId, productId, email } = formData; // Destructure form values
    const baseurl = process.env.NEXT_PUBLIC_APP_URL;

    if (!priceId) {
      throw new Error('Price ID is required');
    }
    try {
      const session = await stripe.checkout.sessions.create({
        allow_promotion_codes: true,
        customer_email: email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseurl}/admin/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseurl}/admin/subscription/cancel`,
        metadata: {
          userId: currentSession.user.id,
          cid: currentSession.user.cid,
          productId: productId,
          priceId: priceId,
        },
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
            className="flex w-1/3 border-2 p-1 mx-auto rounded-md justify-center items-center  border-gray-300 dark:border-gray-600 mb-4" // Adjusted border color and added margin
            aria-label="Select Plan"
          >
            {pricingIntervals.map((interval) => (
              <Tabs.Trigger
                key={interval}
                value={interval}
                onClick={() => setTab(interval)}
                className={`flex-1 justify-center items-center px-3 py-3 text-sm font-semibold transition-colors duration-200 
                  ${tab === interval ? 'text-black rounded-md bg-gray-300' : 'text-gray-500 hover:text-black dark:hover:text-white border-gray-300'}`} // Enhanced hover and active styles
              >
                Per {interval.charAt(0).toUpperCase() + interval.slice(1)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {pricingIntervals.map((interval) => (
            <Tabs.Content
              key={interval}
              value={interval}
              className=" w-full mx-auto rounded-md justify-center items-center flex flex-col" // Updated width to full width on small screens and flex column layout
            >
              <div className=" space-y-0  flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                {products.map((product) => {
                  const price = product?.prices?.find(
                    (price) => price.recurring.interval === interval,
                  );
                  if (!price) return null;

                  const priceString = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0,
                  }).format((price?.unit_amount || 0) / 100);
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        'flex flex-col rounded-lg shadow-sm divide-y text-black border-2',
                        {
                          'border-black': price.id === subscription.priceId,
                        },
                        'flex-1', // This makes the flex item grow to fill the space
                        'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                        'max-w-xs', // Sets a maximum width to the cards to prevent them from getting too large
                      )}
                    >
                      {price.id === subscription.priceId && (
                        <div className="relative">
                          <div className="absolute top-2 right-0 bg-gray-500 text-white px-3 py-1  text-xs">
                            Current
                          </div>
                        </div>
                      )}
                      <div className="p-6 text-black dark:text-white">
                        <h2 className="text-2xl font-semibold leading-6 text-black dark:text-white">
                          {product.name}
                        </h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-100">
                          {product.description}
                        </p>
                        <p className="mt-8">
                          <span className="text-5xl font-extrabold white">
                            {priceString}
                          </span>
                          <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                            /{interval}
                          </span>
                        </p>
                        <Input
                          type="hidden"
                          value={currentSession.user.cid}
                          {...form.register('cid')}
                        />
                        <Input
                          type="hidden"
                          value={currentSession.user.email}
                          {...form.register('email')}
                        />
                        <Input
                          type="hidden"
                          value={currentSession.user.id}
                          {...form.register('userId')}
                        />
                        <Input
                          type="hidden"
                          value={product.id}
                          {...form.register('productId')}
                        />
                        <Input
                          type="hidden"
                          value={price.id}
                          {...form.register('priceId')}
                        />
                        <Button className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white dark:text-black rounded-md">
                          {subscription ? 'Manage' : 'Subscribe'}
                        </Button>
                      </div>
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
