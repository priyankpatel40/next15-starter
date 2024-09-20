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

interface AccountVerifyEmailProps {
  username: string;
  companyName?: string;
  link: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
}

const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;
const AccountVerifyEmail = ({
  username,
  companyName,
  link,
  invitedByUsername,
  invitedByEmail,
}: AccountVerifyEmailProps) => {
  const previewText = `Verify your account`;
  const yourAppNme = process.env.APP_NAME;

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
            {invitedByEmail ? (
              <Section>
                <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                  Join <strong>{companyName}</strong> on <strong>{yourAppNme}</strong>
                </Heading>
                <Text className="text-[14px] leading-[24px] text-black">
                  Hello {username},
                </Text>
                <Text className="text-[14px] leading-[24px] text-black">
                  <strong>{invitedByUsername}</strong> (
                  <Link
                    href={`mailto:${invitedByEmail}`}
                    className="text-blue-600 no-underline"
                  >
                    {invitedByEmail}
                  </Link>
                  ) has invited you to join <strong>{companyName}</strong> on{' '}
                  <strong>{yourAppNme}</strong>.
                </Text>
              </Section>
            ) : (
              <Section>
                <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                  Thank you for signing up
                </Heading>
                <Text className="text-[14px] leading-[24px] text-black">
                  Hello {username},
                </Text>
                <Text className="text-[14px] leading-[24px] text-black">
                  Thank you for showing interest in <strong>{yourAppNme}</strong>. Please
                  click the button below to verify your account and complete your
                  registration.
                </Text>
              </Section>
            )}
            <Section className="my-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Verify your account
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
  companyName: 'Enigma',
  link: `${baseUrl}/new-verification?token=${1234567890}`,
} as AccountVerifyEmailProps;

export default AccountVerifyEmail;
