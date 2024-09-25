'use server';

import { render } from '@react-email/components';
import React from 'react';

import { sendEmail } from '../lib/sendmail';
import AccountVerifyEmail from './accountVerify';
import MagicLinkEmail from './magicLink';
import ResetPasswordEmail from './resetPassword';
import TwoFactorEmail from './twoFactor';

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string,
  username: string,
) => {
  try {
    const emailContent = await render(
      <TwoFactorEmail username={username} code={token} />,
    );

    await sendEmail({
      sendTo: email,
      subject: `${token} - Your two factor authentication code`,
      html: emailContent,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  username: string,
) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  try {
    const emailContent = await render(
      <ResetPasswordEmail username={username} link={resetLink} />,
    );

    await sendEmail({
      sendTo: email,
      subject: 'Reset your password',
      html: emailContent,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const sendVerificationEmail = async (userData: any) => {
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

    await sendEmail({
      sendTo: userData.email,
      subject: 'Confirm your account',
      html: emailContent,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const sendVerificationRequest = async (params: {
  identifier: string;
  url: string;
}) => {
  const { identifier: to, url } = params;

  const emailContent = await render(<MagicLinkEmail username={to} link={url} />);

  await sendEmail({
    sendTo: to,
    subject: 'Login with link',
    html: emailContent,
  });
};
