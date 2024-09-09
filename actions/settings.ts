'use server';
import * as z from 'zod';

import { unstable_update } from '@/auth';
import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  try {
    const updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      },
    });

    const updatedSession = await unstable_update({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      },
    });
    console.log('updatedSession', updatedSession);
    return { success: 'Profile settings updated!' };
  } catch (error) {
    return { error: 'Something went wrong!' };
  }
};
