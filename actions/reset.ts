'use server';

import * as z from 'zod';

import { ResetSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/emails/mail';
import { generatePasswordResetToken } from '@/lib/tokens';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid emaiL!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
    existingUser.name || '',
  );

  return { success: 'Reset email sent!' };
};
