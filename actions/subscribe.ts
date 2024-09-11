import { stripe } from '@/utils/stripe';
import { redirect } from 'next/navigation';

export const createSubscription = async () => {
  const baseurl = process.env.NEXT_PUBLIC_APP_URL;

  const priceId = formData.get('priceId') as string;

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/cancel`,
    });
    redirect(session.url!);
  } catch (error: any) {
    console.error(error.message);
    throw new Error('Failed to create a checkout session');
  }
};
