'use server';
import React from 'react';
import { render } from '@react-email/components';
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
  console.log(
    '🚀 ~ file: mail.ts:72 ~ sendTwoFactorTokenEmail ~ userData:',
    email,
    username,
    token,
  );
  try {
    const emailContent = await render(
      <TwoFactorEmail username={username} code={token} />,
    );
    console.log(
      '🚀 ~ file: mail.ts:85 ~ sendTwoFactorTokenEmail ~ emailContent:',
      emailContent,
    );

    await sendEmail({
      sendTo: email,
      subject: 'Two Factor Authentication code',
      html: emailContent,
    });
  } catch (error) {
    console.log('🚀 ~ file: mail.ts:89 ~ sendTwoFactorTokenEmail ~ error:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  username: string,
) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  console.log(
    '🚀 ~ file: mail.ts:72 ~ sendVerificationEmail ~ userData:',
    email,
    username,
  );
  try {
    const emailContent = await render(
      <ResetPasswordEmail username={username} link={resetLink} />,
    );
    console.log(
      '🚀 ~ file: mail.ts:85 ~ sendVerificationEmail ~ emailContent:',
      emailContent,
    );

    await sendEmail({
      sendTo: email,
      subject: 'Reset your password',
      html: emailContent,
    });
  } catch (error) {
    console.log('🚀 ~ file: mail.ts:89 ~ sendVerificationEmail ~ error:', error);
    return false;
  }
};

export const sendVerificationEmail = async (userData: any) => {
  console.log('🚀 ~ file: mail.ts:72 ~ sendVerificationEmail ~ userData:', userData);
  try {
    const confirmLink = `${domain}/new-verification?token=${userData.token}`;
    const emailContent = await render(
      <AccountVerifyEmail
        username={userData.username}
        company_name={userData.company_name}
        link={confirmLink}
        invitedByUsername={userData.invitedByUsername}
        invitedByEmail={userData.invitedByEmail}
      />,
    );
    console.log(
      '🚀 ~ file: mail.ts:85 ~ sendVerificationEmail ~ emailContent:',
      emailContent,
    );

    await sendEmail({
      sendTo: userData.email,
      subject: 'Confirm your account',
      html: emailContent,
    });
  } catch (error) {
    console.log('🚀 ~ file: mail.ts:89 ~ sendVerificationEmail ~ error:', error);
    return false;
  }
};
