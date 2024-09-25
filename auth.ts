/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
// @ts-nocheck

import type { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getUserById, getUserLoginStatus, saveLoginActivity } from '@/data/user';
import { db } from '@/lib/db';

import { getAccountByUserId } from './data/account';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: '/login',
    error: '/error',
    verifyRequest: '/verify-request',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async signIn(message) {
      await saveLoginActivity(message.user.id);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.cid = token.cid;
        const loginActivity = await getUserLoginStatus(session.user.id);

        session.user.loginId = loginActivity?.id;
      }
      if (token.company) {
        session.user.company = token.company;
      }

      return session;
    },
    async jwt({ token, trigger, session }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      if (trigger === 'update' && session?.email) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.cid = session.cid;
      }

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.cid = existingUser.cid;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      if (existingUser.company) {
        token.company = existingUser.company;
      }
      return token;
    },
  },
  ...authConfig,
});
