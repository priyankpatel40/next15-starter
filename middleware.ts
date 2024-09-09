import NextAuth from 'next-auth';
import { getToken } from 'next-auth/jwt';

import authConfig from '@/auth.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_SIGNUP_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  createCompanyRoute,
  superAdminRoute,
} from '@/routes';
import { UserRole } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // console.log('🚀 ~ file: middleware.ts:21 ~ auth ~ isLoggedIn:', isLoggedIn);
  // console.log('🚀 ~ auth ~ process.env.NODE_ENV:', process.env.NODE_ENV);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isSuperAdminRoute = superAdminRoute.includes(nextUrl.pathname);
  const isCreateCompanyRoute = createCompanyRoute.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === 'production'
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token',
  });
  // console.log('🚀 ~ auth ~ token:', token);
  const userHasCompany = token?.cid;

  if (isLoggedIn) {
    if (isSuperAdminRoute) {
      if (token?.role !== UserRole.SUPERADMIN) {
        // return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    }
    if (!isCreateCompanyRoute) {
      if (!userHasCompany) {
        // return Response.redirect(new URL(DEFAULT_SIGNUP_REDIRECT, nextUrl));
        return NextResponse.redirect(new URL(DEFAULT_SIGNUP_REDIRECT, nextUrl));
      } else {
        return null;
      }
    } else {
      if (userHasCompany) {
        // return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    }

    console.log(token?.role !== UserRole.SUPERADMIN);
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
