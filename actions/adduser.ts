'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { CreateUserSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { Prisma, UserRole } from '@prisma/client';

import { generateVerificationToken } from '@/lib/tokens';
import { auth } from '@/auth';
import { sendVerificationEmail } from '@/emails/mail';
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
        role: role,
        cid: currentSession?.user.cid,
        created_by: currentSession?.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true,
        created_by: true,
        is_deleted: true,
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
      company_name: currentSession?.user.company.company_name,
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
    console.error('Error during user registration:', e);
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
