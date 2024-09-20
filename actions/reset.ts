'use server';

import type * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/emails/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetSchema } from '@/schemas';

const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid emaiL!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const passwordResetToken = (await generatePasswordResetToken(email)) as {
    email: string;
    token: string;
  };
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
    existingUser.name || '',
  );

  return {
    success: 'We have sent the reset password email to your account with a link!',
  };
};
export default reset;
