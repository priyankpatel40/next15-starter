'use server';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { ChangePasswordSchema } from '@/schemas';
import { getUserById } from '@/data/user';
import { db } from '@/lib/db';
import { auth } from '@/auth';

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
