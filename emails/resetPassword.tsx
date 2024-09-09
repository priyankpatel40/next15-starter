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

interface ResetPasswordProps {
  username: string;
  link: string;
}

const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;
const app_name = process.env.APP_NAME || 'Your Company';
const ResetPasswordEmail = ({ username, link }: ResetPasswordProps) => {
  const previewText = `Reset your password`;

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

            <Section>
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Trouble signing in?
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                Hello {username},
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                You recently requested to reset the password for your account. Click the
                button below to proceed.
              </Text>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={link}
              >
                Reset my password
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
              This was intended for <span className="text-black">{username}</span>. If you
              did not request a password reset, please ignore this email or reply to let
              us know. This password reset link is only valid for the next 60 minutes.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  username: 'alanturing',
  link: `${baseUrl}/new-password?token=${1234567890}`,
} as ResetPasswordProps;

export default ResetPasswordEmail;
