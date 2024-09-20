'use server';

import type { User } from '@prisma/client';
import type * as z from 'zod';

import { signIn } from '@/auth';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/emails/mail';
import { db } from '@/lib/db';
import logger from '@/lib/logger';
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: true, message: 'Invalid fields!' };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = (await getUserByEmail(email)) as User;
  logger.info('🚀 ~ existingUser:', existingUser);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: true, message: 'Invalid credentials!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = (await generateVerificationToken(existingUser.email)) as {
      email: string;
      token: string;
    };
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
      username: existingUser.name,
      invitedByUsername: '',
      invitedByEmail: '',
      companyName: '',
    });

    return { success: true, message: 'Confirmation email sent!' };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: true, message: 'Invalid code!' };
      }

      if (twoFactorToken.token !== code) {
        return { error: true, message: 'Invalid code!' };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: true, message: 'Code expired!' };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
        existingUser.name || '',
      );

      return { success: true, twoFactor: true };
    }
  }

  try {
    logger.info('insingin');
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    return null;
  } catch (error) {
    logger.info('🚀 ~ error:', error);
    throw error;
  }
};

export const resendCode = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: true, message: 'Email does not exist!' };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    try {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
        existingUser.name || '',
      );

      return { success: true, message: 'Code sent!' };
    } catch (error) {
      return { error: true, message: 'Failed to send code!' };
    }
  } else {
    return { error: true, message: 'Something went wrong!' };
  }
};
