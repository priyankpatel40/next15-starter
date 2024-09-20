'use server';

import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type * as z from 'zod';

import { auth } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/emails/mail';
import { db } from '@/lib/db';
import logger from '@/lib/logger';
import { generateVerificationToken } from '@/lib/tokens';
import { CreateUserSchema } from '@/schemas';

export const addUser = async (values: z.infer<typeof CreateUserSchema>) => {
  const validatedFields = CreateUserSchema.safeParse(values);
  const currentSession = await auth();
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  let result = null;
  const { email, password, name, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      error: 'This email is already registered!',
    };
  }
  try {
    result = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        cid: currentSession?.user.cid,
        createdBy: currentSession?.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        createdBy: true,
        isDeleted: true,
        emailVerified: true,
      },
    });
    const verificationToken = await generateVerificationToken(email);
    const typedToken = verificationToken as { email: string; token: string };
    await sendVerificationEmail({
      email: typedToken.email,
      token: typedToken.token,
      username: name,
      invitedByUsername: currentSession?.user.name,
      invitedByEmail: currentSession?.user.email,
      companyName: currentSession?.user.company.companyName,
    });
    const userWithCreatorName = {
      ...result,
      creatorName: currentSession?.user.name,
    };
    return {
      success: 'We have sent an email to the user to verify their account.',
      user: userWithCreatorName,
    };
  } catch (e) {
    // Error handling
    let errorMessage: string = 'Something went wrong, unable to add your user.';
    logger.error('Error during user registration:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        errorMessage = 'You already have an account.';
      }
    } else {
      errorMessage = 'Something went wrong, unable to add your user.';
    }
    return { error: errorMessage };
  }
};
