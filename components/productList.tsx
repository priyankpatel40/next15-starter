'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMemo, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/helpers';
import { SubscriptionSchema } from '@/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSession } from '@/actions/subscribe';
import { showToast } from './ui/toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const router = useRouter();
  const [tab, setTab] = useState('');
  const pricingIntervals = useMemo(() => {
    const intervals = new Set<string>();
    products.forEach((product) => {
      product.prices.forEach((price) => {
        intervals.add(price.recurring.interval);
      });
    });
    const intervalsArray = Array.from(intervals).sort();
    setTab(intervalsArray[0]);
    return intervalsArray;
  }, [products]);

  const [quantity, setQuantity] = useState(subscription?.quantity || 1); // Set initial quantity from subscription

  const form = useForm<z.infer<typeof SubscriptionSchema>>({
    resolver: zodResolver(SubscriptionSchema),
    defaultValues: {
      quantity: subscription?.quantity || 1, // Updated to use optional chaining
    },
  });

  const handleValueChange = (value: number) => {
    setQuantity(value);
    form.setValue('quantity', value); // Ensure form value is also updated
  };

  const handleProductSubmit = async (product: Product, price: Price) => {
    const values = form.getValues();
    const submissionData = {
      ...values,
      productId: product.id,
      priceId: price.id,
      cid: currentSession.user.cid,
      email: currentSession.user.email,
      userId: currentSession.user.id,
    };

    const session = await createSession(submissionData);
    if (session.success) {
      router.push(session.url);
    } else {
      showToast({
        message: session.message,
        type: 'error',
      });
    }
  };
  console.log('🚀 ~ file: productList.tsx:108 ~ subscription:', subscription);

  if (subscription.quantity) {
    console.log('🚀 ~ file: productList.tsx:108 ~ subscription:', subscription);
    // setQuantity(subscription.quantity);
  }
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <Tabs.Root
          defaultValue={pricingIntervals[0]}
          className="flex flex-col items-center space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between w-full mb-6">
            <div className="flex flex-wrap items-center justify-center w-full md:justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="text-sm mt-1.5">
                        Required User licenses
                      </FormLabel>
                      <Select
                        onValueChange={(value) => handleValueChange(Number(value))}
                        defaultValue={quantity.toString()} // Set default value to current quantity
                      >
                        <FormControl>
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, index) => index + 1).map(
                            (qty) => (
                              <SelectItem key={qty} value={qty.toString()}>
                                {qty}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Tabs.List
                className="flex w-full md:w-auto border p-1 rounded-md justify-around items-center bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm"
                aria-label="Select Plan"
              >
                {pricingIntervals.map((interval) => (
                  <Tabs.Trigger
                    key={interval}
                    value={interval}
                    onClick={() => setTab(interval)}
                    className={`px-4 py-2 text-center text-sm font-semibold rounded-md transition-colors duration-200 
                ${tab === interval ? 'bg-gray-300 dark:bg-gray-700' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                  >
                    Per {interval.charAt(0).toUpperCase() + interval.slice(1)}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
          </div>

          {pricingIntervals.map((interval) => (
            <Tabs.Content
              key={interval}
              value={interval}
              className="w-full flex flex-col items-center justify-center space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:max-w-4xl mx-auto">
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
                        'flex flex-col relative justify-start rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-6 transition-transform duration-200 hover:scale-105',
                        {
                          'border-black border-2':
                            subscription && price.id === subscription.priceId,
                        },
                        'flex-1',
                      )}
                    >
                      {subscription && price.id === subscription.priceId && (
                        <div className="relative">
                          <div className="absolute top-0 right-0 bg-green-700 rounded-md text-white px-3 py-1 text-xs">
                            Current
                          </div>
                        </div>
                      )}

                      <div className="text-black dark:text-white">
                        <h2 className="text-xl font-semibold leading-6">
                          {product.name}
                        </h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                          {product.description}
                        </p>
                        {product.marketing_features.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {product.marketing_features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center text-gray-600 dark:text-gray-300"
                              >
                                <svg
                                  className="w-4 h-4 mr-2 text-green-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>{feature.name}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex items-center justify-between mt-8">
                          <p className="text-3xl font-extrabold">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: price.currency!,
                              minimumFractionDigits: 0,
                            }).format(
                              (parseFloat(priceString.replace(/[^0-9.-]+/g, '')) || 0) *
                                quantity || 0,
                            )}
                            <span className="text-base font-medium text-gray-800 dark:text-gray-400">
                              /{interval}
                            </span>
                          </p>
                        </div>

                        <Button
                          className="block w-full py-2 mt-8 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-200 transition"
                          onClick={() => handleProductSubmit(product, price)}
                        >
                          Subscribe
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
