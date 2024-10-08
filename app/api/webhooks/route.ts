import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { createSubscription, updateSubscriptionData } from '@/data/subscription';
import { stripe } from '@/utils/stripe';

export async function GET() {
  return new NextResponse('Working', { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature');
    const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing Stripe signature or secret' },
        { status: 400 },
      );
    }
    let event: Stripe.Event | null = null;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

      switch (event.type) {
        case 'checkout.session.completed': {
          const subscription = event.data.object as Stripe.Checkout.Session;
          if (subscription) {
            if (subscription.mode === 'subscription') {
              const subscriptionId = subscription.subscription! as string;
              const status = subscription.payment_status!;
              const userId = subscription.metadata?.userId!;
              const cid = subscription.metadata?.cid!;
              const productId = subscription.metadata?.productId!;
              const priceId = subscription.metadata?.priceId!;
              const quantity = parseInt(subscription.metadata?.quantity || '1', 10);

              const currentSubscription =
                await stripe.subscriptions.retrieve(subscriptionId);
              const data = JSON.stringify(currentSubscription);
              await createSubscription({
                userId,
                subscriptionId,
                cid,
                status,
                productId,
                priceId,
                quantity,
                data,
              });
            }
          }
          break;
        }
        case 'customer.subscription.updated': {
          const updatedSubscription = event.data.object as Stripe.Subscription;
          const subscriptionId = updatedSubscription.id;
          const { status } = updatedSubscription;

          const subscriptionItem = updatedSubscription.items.data[0];
          if (!subscriptionItem) {
            return NextResponse.json(
              { error: 'Subscription item is missing' },
              { status: 400 },
            );
          }

          const productId = subscriptionItem.plan?.product as string;
          const priceId = subscriptionItem.plan?.id;
          const quantity = subscriptionItem.quantity || 1;

          if (!productId || !priceId) {
            return NextResponse.json(
              { error: 'Product ID or Price ID is missing' },
              { status: 400 },
            );
          }

          const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
          const data = JSON.stringify(currentSubscription);

          await updateSubscriptionData({
            subscriptionId,
            status,
            productId,
            priceId,
            quantity,
            data,
          });

          break;
        }

        case 'customer.subscription.deleted': {
          // await deleteSubscription({
          //   subscriptionId: deletedSubscription.id,
          //   status: deletedSubscription.status,
          //   isActive: false,
          // });
          break;
        }
        default: {
          break;
        }
      }
      return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
    } catch (error) {
      return new NextResponse('Invalid Stripe Signature', { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      // Handle known error types
      return new NextResponse(error.message, { status: 400 });
    }

    // Handle unexpected or unknown errors
    return new NextResponse('An unknown error occurred', { status: 500 });
  }
}
