import { SubscriptionSchema } from '@/schemas';
import { stripe } from '@/utils/stripe';
import { z } from 'zod';

export const createSession = async (values: z.infer<typeof SubscriptionSchema>) => {
  const validatedFields = SubscriptionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  let result = null;
  const { cid, userId, priceId, productId, email, quantity } = validatedFields.data;
  console.log(
    '🚀 ~ file: subscribe.ts:12 ~ createSession ~ validatedFields.data:',
    validatedFields.data,
  );
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
          quantity: quantity,
        },
      ],
      mode: 'subscription',
      success_url: `${baseurl}/admin/settings/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseurl}/admin/settings/`,
      metadata: {
        userId: userId,
        cid: cid,
        productId: productId,
        priceId: priceId,
        quantity: quantity,
      },
    });
    return { success: true, url: session.url };
  } catch (error: any) {
    console.error(error.message);
    return { error: true, message: error.message };
  }
};
