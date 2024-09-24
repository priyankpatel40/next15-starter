'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verificiation-token';
import { db } from '@/lib/db';
import logger from '@/lib/logger';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  logger.info('🚀 ~ newVerification ~ existingToken:', existingToken);

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
  logger.info('🚀 ~ newVerification ~ existingUser:', existingUser);

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
  await db.accountVerificationToken.delete({
    where: { id: existingToken.id },
  });

  return {
    success: 'Congratulations! Your Email is verified now, redirecting you to login!',
  };
};
