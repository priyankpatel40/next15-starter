'use server';

import type * as z from 'zod';

import { unstable_update } from '@/auth';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import logger from '@/lib/logger';
import type { SettingsSchema } from '@/schemas';

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
    logger.info('updatedSession', updatedSession);
    return { success: 'Profile settings updated!' };
  } catch (error) {
    return { error: 'Something went wrong!' };
  }
};
