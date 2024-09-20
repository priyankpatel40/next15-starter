'use server';

import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { updateUserLoginStatus } from '@/data/user';
import logger from '@/lib/logger';

export const logout = async () => {
  // This is due to NextAuth V5 has some redirect issue with NextJs 15
  const currentSession = await auth();
  try {
    await updateUserLoginStatus(currentSession?.user.loginId);
    await signOut();
    redirect('/login');
  } catch (error) {
    logger.error('Logout error:', error);
    redirect('/login');
  }
};
