'use server';

import { Prisma, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/emails/mail';
import { db } from '@/lib/db';
import logger from '@/lib/logger';
import { generateVerificationToken } from '@/lib/tokens';
import { RegisterSchema } from '@/schemas';

const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: "You're already registered with us! Please Sign in to continue !",
    };
  }
  try {
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.ADMIN,
      },
    });
    const verificationToken = (await generateVerificationToken(email)) as {
      email: string;
      token: string;
    };
    logger.info('verificationToken', verificationToken);
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
      username: name,
      invitedByUsername: '',
      invitedByEmail: '',
      companyName: '',
    });
  } catch (e) {
    // Error handling
    let errorMessage: string = 'Something went wrong, unable to create your account.';
    logger.error('Error during user registration:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        errorMessage = 'You already have an account.';
      }
    } else {
      errorMessage = 'Something went wrong, unable to create your account.';
    }
    return { error: errorMessage };
  }
  return {
    success: 'Confirmation email sent, please verify your account to start!',
  };
};
export default register;
