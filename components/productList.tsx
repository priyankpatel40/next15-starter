'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as Tabs from '@radix-ui/react-tabs';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { Stripe } from 'stripe'; // Import Stripe types
import type { z } from 'zod';

import { createSession, updateStripeSubscription } from '@/actions/subscribe';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubscriptionSchema } from '@/schemas';
import { cn } from '@/utils/helpers';

import { showToast } from './ui/toast';

interface PricingTabsProps {
  products: Array<Stripe.Product & { prices: Stripe.Price[] }>;
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
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('SubscriptionPage.ProductList');

  const pricingIntervals = useMemo(() => {
    const intervals = new Set<string>();
    products.forEach((product) => {
      product.prices.forEach((price) => {
        if (price.recurring) {
          intervals.add(price.recurring.interval);
        }
      });
    });
    const intervalsArray = Array.from(intervals).sort();
    if (intervalsArray.length > 0) {
      setTab(intervalsArray[0] || '');
    }
    return intervalsArray;
  }, [products]);

  const [quantity, setQuantity] = useState(
    subscription && subscription?.status !== 'canceled' ? subscription?.quantity : 1,
  );

  const form = useForm<z.infer<typeof SubscriptionSchema>>({
    resolver: zodResolver(SubscriptionSchema),
    defaultValues: {
      quantity:
        subscription && subscription?.status !== 'canceled' ? subscription?.quantity : 1,
    },
  });

  const handleValueChange = (value: number) => {
    setQuantity(value);
    form.setValue('quantity', value); // Ensure form value is also updated
  };

  const handleProductSubmit = async (product: Stripe.Product, price: Stripe.Price) => {
    startTransition(async () => {
      const values = form.getValues();

      const submissionData = {
        ...values,
        productId: product.id,
        priceId: price.id,
        cid: currentSession.user.cid,
        email: currentSession.user.email,
        userId: currentSession.user.id,
      };
      if (subscription?.stripeSubscriptionId && subscription?.status !== 'canceled') {
        if (
          product.id !== subscription.productId ||
          price.id !== subscription.priceId ||
          quantity !== subscription.quantity
        ) {
          const result = await updateStripeSubscription(
            submissionData,
            subscription.stripeSubscriptionId,
          );
          if (result?.success) {
            showToast({
              message: t('success'),
              type: 'success',
            });
            router.refresh();
          }
        }
      } else {
        const session = await createSession(submissionData);
        if (session.success) {
          router.push(session.url || '');
        } else {
          showToast({
            message: t('error'),
            type: 'error',
          });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <Tabs.Root
          defaultValue={pricingIntervals[0]}
          className="flex flex-col items-center space-y-6"
        >
          <div className="mb-6 flex w-full flex-wrap items-center justify-between">
            <div className="flex w-full flex-wrap items-center justify-center space-y-4 md:justify-center md:space-x-8 md:space-y-0">
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={() => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="mt-1.5 text-sm">{t('license')}</FormLabel>
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
                className="flex w-full items-center justify-around rounded-md border border-gray-300 bg-gray-100 p-1 shadow-sm dark:border-gray-600 dark:bg-gray-800 md:w-auto"
                aria-label="Select Plan"
              >
                {pricingIntervals.map((interval) => (
                  <Tabs.Trigger
                    key={interval}
                    value={interval}
                    onClick={() => setTab(interval)}
                    className={`rounded-md px-4 py-2 text-center text-sm font-semibold transition-colors duration-200 
                ${tab === interval ? 'bg-gray-300 dark:bg-gray-700' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                  >
                    {interval.charAt(0).toUpperCase() + interval.slice(1)}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
          </div>

          {pricingIntervals.map((interval) => (
            <Tabs.Content
              key={`${interval}-${1}`}
              value={interval}
              className="flex w-full flex-col items-center justify-center space-y-6"
            >
              <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-4xl lg:grid-cols-2">
                {products.map((product) => {
                  const price = product?.prices?.find((p) => {
                    if (p.recurring) {
                      return p.recurring.interval === interval;
                    }
                    return null;
                  });
                  if (!price) return null;

                  const priceString = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0,
                  }).format((price?.unit_amount || 0) / 100);

                  return (
                    <div
                      key={`${product.id}-${price.id}`}
                      className={cn(
                        'relative flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-transform duration-200 hover:scale-105 dark:border-gray-700 dark:bg-gray-800',
                        {
                          'border-black border-2':
                            subscription &&
                            price.id === subscription.priceId &&
                            subscription.status !== 'canceled',
                        },
                        'flex-1',
                      )}
                    >
                      {subscription &&
                        price.id === subscription.priceId &&
                        subscription.status !== 'canceled' && (
                          <div className="relative">
                            <div className="absolute right-0 top-0 rounded-md bg-green-700 px-3 py-1 text-xs text-white">
                              {t('current')}
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
                            {product.marketing_features.map((feature) => (
                              <li
                                key={`${feature.name}-${product.id}-${price.id}`}
                                className="flex items-center text-gray-600 dark:text-gray-300"
                              >
                                <svg
                                  className="mr-2 size-4 text-green-500"
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

                        <div className="mt-8 flex items-center justify-between">
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
                              /{price.recurring?.interval}
                            </span>
                          </p>
                        </div>
                        <Button
                          onClick={() => handleProductSubmit(product, price)}
                          isLoading={isPending}
                          variant={
                            subscription &&
                            price.id === subscription.priceId &&
                            quantity === subscription.quantity &&
                            subscription.status !== 'canceled'
                              ? 'outline'
                              : 'default'
                          }
                          className="mt-4 w-full"
                          disabled={
                            isPending ||
                            (subscription &&
                              price.id === subscription.priceId &&
                              quantity === subscription.quantity &&
                              subscription.status !== 'canceled')
                          }
                        >
                          {subscription &&
                          price.id === subscription.priceId &&
                          quantity === subscription.quantity &&
                          subscription.status !== 'canceled'
                            ? t('btnCurrent')
                            : t('btn')}
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
