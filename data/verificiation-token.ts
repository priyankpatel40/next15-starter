import { db } from '@/lib/db';
import logger from '@/lib/logger';

export const getVerificationTokenByToken = async (token: string) => {
  logger.info('🚀 ~ token:', token);
  try {
    const verificationToken = await db.accountVerificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.accountVerificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
