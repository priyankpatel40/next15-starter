'use server';

import { signOut } from '@/auth';
import { redirect } from 'next/navigation';

export const logout = async () => {
  // This is due to NextAuth V5 has some redirect issue with NextJs 15
  try {
    await signOut();
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    redirect('/login');
  }
};
