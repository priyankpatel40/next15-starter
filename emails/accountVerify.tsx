import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface AccountVerifyEmailProps {
  username: string;
  company_name?: string;
  link: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}`
  : 'http://localhost:3000';
const app_name = process.env.APP_NAME || 'Your Company';
const AccountVerifyEmail = ({
  username,
  company_name,
  link,
  invitedByUsername,
  invitedByEmail,
}: AccountVerifyEmailProps) => {
  const previewText = `Verify your account`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}small-light.png`}
                width="60"
                height="60"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            {invitedByEmail ? (
              <Section>
                <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                  Join <strong>{company_name}</strong> on <strong>{app_name}</strong>
                </Heading>
                <Text className="text-black text-[14px] leading-[24px]">
                  Hello {username},
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                  <strong>{invitedByUsername}</strong> (
                  <Link
                    href={`mailto:${invitedByEmail}`}
                    className="text-blue-600 no-underline"
                  >
                    {invitedByEmail}
                  </Link>
                  ) has invited you to join <strong>{company_name}</strong> on{' '}
                  <strong>{app_name}</strong>.
                </Text>
              </Section>
            ) : (
              <Section>
                <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                  Thank you for signing up
                </Heading>
                <Text className="text-black text-[14px] leading-[24px]">
                  Hello {username},
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                  Thank you for showing interest in <strong>{app_name}</strong>. Please
                  click the button below to verify your account and complete your
                  registration.
                </Text>
              </Section>
            )}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={link}
              >
                Verify your account
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{' '}
              <span className="text-black">{username}</span>. If you were not expecting
              this invitation, you can ignore this email. If you are concerned about your
              account&apos;s safety, please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AccountVerifyEmail.PreviewProps = {
  username: 'alanturing',
  invitedByUsername: 'Alan',
  invitedByEmail: 'alan.turing@example.com',
  company_name: 'Enigma',
  link: `${baseUrl}/new-verification?token=${1234567890}`,
} as AccountVerifyEmailProps;

export default AccountVerifyEmail;
