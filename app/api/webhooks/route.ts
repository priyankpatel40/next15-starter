import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { updateSubscription, createSubscription } from '@/data/subscription';
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
            const subscriptionId = subscription.id;
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
        case 'customer.subscription.deleted':
          const deletedsubscription = event.data.object as Stripe.Subscription;
          console.log('🚀 ~ POST ~ session:', deletedsubscription);

          await await updateSubscription({
            subscriptionId: deletedsubscription.id,
            status: deletedsubscription.status,
          });
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
