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

export const sendEmail = async ({
  sendTo,
  subject,
  html,
}: {
  sendTo: string;
  subject: string;
  html?: any;
}) => {
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
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', sendTo);
  return info;
};
