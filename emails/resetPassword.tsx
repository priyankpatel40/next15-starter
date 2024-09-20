import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordProps {
  username: string;
  link: string;
}

const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;
const ResetPasswordEmail = ({ username, link }: ResetPasswordProps) => {
  const previewText = `Reset your password`;

  return (
    <Html>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Head>
          <style>
            {`
            @media (prefers-color-scheme: dark) {
              .dark\\:block {
                display: block !important;
              }
              .dark\\:hidden {
                display: none !important;
              }
            }
          `}
          </style>
        </Head>
        <Body className="m-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}small-light.png`}
                width="60"
                height="60"
                alt="Your company"
                className="mx-auto my-0 dark:hidden"
              />
              <Img
                src={`${baseUrl}small-dark.png`}
                width="60"
                height="60"
                alt="Your company"
                className="mx-auto my-0 hidden dark:block"
              />
            </Section>

            <Section>
              <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                Trouble signing in?
              </Heading>
              <Text className="text-[14px] leading-[24px] text-black">
                Hello {username},
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                You recently requested to reset the password for your account. Click the
                button below to proceed.
              </Text>
            </Section>

            <Section className="my-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Reset my password
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
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
