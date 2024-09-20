import nodemailer from 'nodemailer';

import logger from './logger';

const { SMTP_SERVER_HOST, SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD } = process.env;
const SMTP_SERVER_PORT = Number(process.env.SMTP_SERVER_PORT); // Ensure port is a number
const FROM = 'getCompany@gmail.com';

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST as string, // Assert type if necessary
  port: SMTP_SERVER_PORT,
  secure: false,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

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
    await transporter.verify();
  } catch (error) {
    logger.error('Error in Sending Email:', error);
    return;
  }

  try {
    await transporter.sendMail({
      from: FROM,
      to: sendTo,
      subject,
      html: html || '',
    });
    logger.info('Mail sent to:', sendTo);
  } catch (error) {
    logger.error('Mail sending failed:', error);
  }
};
