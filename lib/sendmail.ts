import { Resend } from 'resend';

import logger from './logger';

const resend = new Resend(process.env.RESEND_KEY);
const FROM = process.env.EMAIL_FROM || 'yourcompany@email.com';

export const sendEmail = async ({
  sendTo,
  subject,
  html,
}: {
  sendTo: string;
  subject: string;
  html?: string; // Adjusted to string for better type safety
}): Promise<void> => {
  try {
    await resend.emails.send({
      from: FROM,
      to: [sendTo],
      subject,
      html: html || '',
    });
    logger.info('Mail sent to:', sendTo);
  } catch (error) {
    logger.error('Mail sending failed:', error);
  }
};
