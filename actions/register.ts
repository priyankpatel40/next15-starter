'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { Prisma, UserRole } from '@prisma/client';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  console.log('🚀 ~ register ~ email:', email);

  if (existingUser) {
    return {
      error: "You're already registered with us! Please Sign in to continue !",
    };
  }
  try {
    const result = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.ADMIN,
      },
    });
    const verificationToken = await generateVerificationToken(email);
    console.log('verificationToken', verificationToken);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
  } catch (e) {
    // Error handling
    let errorMessage: string = 'Something went wrong, unable to create your account.';
    console.error('Error during user registration:', e);
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
