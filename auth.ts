import NextAuth from 'next-auth';
import { UserRole } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/db';
import authConfig from '@/auth.config';
import { getUserById, getUserLoginStatus, saveLoginActivity } from '@/data/user';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
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
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async signIn(message) {
      console.log('🚀 ~ signIn ~ message:', message);
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
        //console.log('🚀 ~ session ~ loginActivity:', session);
      }
      if (token.company) {
        session.user.company = token.company;
      }

      // console.log('🚀 ~ file: auth.ts:76 ~ session ~ session:', session);
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
        // console.log('🚀 ~ jwt ~ token:', token);
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

      // console.log('🚀 ~ jwt ~ token:', token);
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
