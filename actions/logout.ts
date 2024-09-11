'use server';

import { auth, signOut } from '@/auth';
import { updateUserLoginStatus } from '@/data/user';
import { redirect } from 'next/navigation';

export const logout = async () => {
  // This is due to NextAuth V5 has some redirect issue with NextJs 15
  const currentSession = await auth();
  try {
    await updateUserLoginStatus(currentSession?.user.loginId);
    await signOut();
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    redirect('/login');
  }
};
