import { db } from '@/lib/db';

export const getVerificationTokenByToken = async (token: string) => {
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
