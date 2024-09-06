'use server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verificiation-token';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  console.log('🚀 ~ newVerification ~ existingToken:', existingToken);

  if (!existingToken) {
    return {
      error: 'Token does not exist or the account is already verified!',
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  console.log('🚀 ~ newVerification ~ existingUser:', existingUser);

  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }

  // Update user's email verification status
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // Delete the used verification token
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return {
    success: 'Congratulations! Your Email is verified now, redirecting you to login!',
  };
};
