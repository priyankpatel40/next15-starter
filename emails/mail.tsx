'use server';

import { render } from '@react-email/components';
import React from 'react';

import logger from '@/lib/logger';

import { sendEmail } from '../lib/sendmail';
import AccountVerifyEmail from './accountVerify';
import ResetPasswordEmail from './resetPassword';
import TwoFactorEmail from './twoFactor';

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string,
  username: string,
) => {
  logger.info(
    '🚀 ~ file: mail.ts:72 ~ sendTwoFactorTokenEmail ~ userData:',
    email,
    username,
    token,
  );
  try {
    const emailContent = await render(
      <TwoFactorEmail username={username} code={token} />,
    );
    logger.info(
      '🚀 ~ file: mail.ts:85 ~ sendTwoFactorTokenEmail ~ emailContent:',
      emailContent,
    );

    await sendEmail({
      sendTo: email,
      subject: `${token} - Your two factor authentication code`,
      html: emailContent,
    });
    return true;
  } catch (error) {
    logger.info('🚀 ~ file: mail.ts:89 ~ sendTwoFactorTokenEmail ~ error:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  username: string,
) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  logger.info(
    '🚀 ~ file: mail.ts:72 ~ sendVerificationEmail ~ userData:',
    email,
    username,
  );
  try {
    const emailContent = await render(
      <ResetPasswordEmail username={username} link={resetLink} />,
    );
    logger.info(
      '🚀 ~ file: mail.ts:85 ~ sendVerificationEmail ~ emailContent:',
      emailContent,
    );

    await sendEmail({
      sendTo: email,
      subject: 'Reset your password',
      html: emailContent,
    });
    return true;
  } catch (error) {
    logger.info('🚀 ~ file: mail.ts:89 ~ sendVerificationEmail ~ error:', error);
    return false;
  }
};

export const sendVerificationEmail = async (userData: any) => {
  logger.info('🚀 ~ file: mail.ts:72 ~ sendVerificationEmail ~ userData:', userData);
  try {
    const confirmLink = `${domain}/new-verification?token=${userData.token}`;
    const emailContent = await render(
      <AccountVerifyEmail
        username={userData.username}
        companyName={userData.companyName}
        link={confirmLink}
        invitedByUsername={userData.invitedByUsername}
        invitedByEmail={userData.invitedByEmail}
      />,
    );
    logger.info(
      '🚀 ~ file: mail.ts:85 ~ sendVerificationEmail ~ emailContent:',
      emailContent,
    );

    await sendEmail({
      sendTo: userData.email,
      subject: 'Confirm your account',
      html: emailContent,
    });
    return true;
  } catch (error) {
    logger.info('🚀 ~ file: mail.ts:89 ~ sendVerificationEmail ~ error:', error);
    return false;
  }
};
