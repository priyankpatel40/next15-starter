'use server';

import bcrypt from 'bcryptjs';
import type * as z from 'zod';

import { auth } from '@/auth';
import { getUserById } from '@/data/user';
import { db } from '@/lib/db';
import { ChangePasswordSchema } from '@/schemas';

export const changePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {
  const validatedFields = ChangePasswordSchema.safeParse(values);
  const currentSession = await auth();
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { newPassword, confirmPassword } = validatedFields.data;

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match!' };
  }

  const existingUser = await getUserById(currentSession.user.id);

  if (!existingUser) {
    return { error: 'User does not exist!' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    return { success: 'Password updated!' };
  } catch (error) {
    return { error: 'Something went wrong!' };
  }
};
