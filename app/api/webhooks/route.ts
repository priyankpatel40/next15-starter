import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import {
  updateSubscriptionData,
  createSubscription,
  deleteSubscription,
} from '@/data/subscription';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function GET() {
  return new NextResponse('Working', { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature');
    const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!signature || !webhookSecret) {
      console.error('Missing Stripe signature or secret');
      return NextResponse.json(
        { error: 'Missing Stripe signature or secret' },
        { status: 400 },
      );
    }
    let event: Stripe.Event | null = null;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('eventType:', event.type);
      if (event.type === 'checkout.session.completed') {
        console.log('checkout.session.completed:', event.data.object);
      }
      switch (event.type) {
        case 'checkout.session.completed':
          const subscription = event.data.object as Stripe.Checkout.Session;
          if (subscription.mode === 'subscription') {
            console.log('🚀 ~ POST ~ session:', subscription);
            const subscriptionId = subscription.subscription;
            const status = subscription.payment_status;
            const userId = subscription.metadata?.userId;
            const cid = subscription.metadata?.cid;
            const productId = subscription.metadata?.productId;
            const priceId = subscription.metadata?.priceId;
            const quantity = parseInt(subscription.metadata?.quantity || '1');
            await createSubscription({
              userId,
              subscriptionId,
              cid,
              status,
              productId,
              priceId,
              quantity,
            });
          }
          break;
        case 'customer.subscription.updated':
          const updatedSubscription = event.data.object as Stripe.Subscription;
          const subscriptionId = updatedSubscription.id;
          const status = updatedSubscription.status;
          const productId = updatedSubscription.items.data[0].plan.product;
          const priceId = updatedSubscription.items.data[0].plan.id;
          const quantity = updatedSubscription.items.data[0].quantity || 1;
          console.log('🚀 ~ POST ~ session:', updatedSubscription);

          const updateResult = await updateSubscriptionData({
            subscriptionId,
            status,
            productId,
            priceId,
            quantity,
          });
          console.log('🚀 ~ file: route.ts:82 ~ POST ~ updateResult:', updateResult);
          break;
        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as Stripe.Subscription;
          console.log('🚀 ~ POST ~ session:', deletedSubscription);

          // await deleteSubscription({
          //   subscriptionId: deletedSubscription.id,
          //   status: deletedSubscription.status,
          //   is_active: false,
          // });
          break;
        default:
          console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
          break;
      }
      return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
    } catch (error) {
      console.error('Error processing webhook:', error);

      return new NextResponse('Invalid Stripe Signature', { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, { status: 400 });
  }
}
