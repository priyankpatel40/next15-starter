'use server';

import { UserRole } from '@prisma/client';

import { currentRole } from '@/lib/auth';

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN || role === UserRole.SUPERADMIN) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};
