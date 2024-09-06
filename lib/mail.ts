'use server';
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SMTP_SERVER_PORT = process.env.SMTP_SERVER_PORT;
const FROM = 'getCompany@gmail.com';

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: SMTP_SERVER_PORT,
  secure: false,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendEmail({
  sendTo,
  subject,
  text,
  html,
}: {
  sendTo: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error(
      'Something Went Wrong',
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error,
    );
    return;
  }
  const info = await transporter.sendMail({
    from: FROM,
    to: sendTo,
    subject: subject,
    text: text ? html : '',
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', sendTo);
  return info;
}

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const emailContent = `<p>Your 2FA code: ${token}</p>`;
  await sendEmail({ sendTo: email, subject: '2FA Code', html: emailContent });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  const emailContent = `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`;

  await sendEmail({
    sendTo: email,
    subject: 'Reset your password',
    html: emailContent,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;
  try {
    const emailContent = `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`;

    await sendEmail({
      sendTo: email,
      subject: 'Confirm your account',
      html: emailContent,
    });
  } catch (error) {
    return false;
  }
};
