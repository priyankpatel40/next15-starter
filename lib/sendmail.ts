import { Resend } from 'resend';

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
  await resend.emails.send({
    from: FROM,
    to: [sendTo],
    subject,
    html: html || '',
  });
};
