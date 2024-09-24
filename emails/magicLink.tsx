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

interface MagicLinkEmailProps {
  username: string;
  link: string;
}

const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;
const MagicLinkEmail = ({ username, link }: MagicLinkEmailProps) => {
  const previewText = `Login in your account`;

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
                Your Login link
              </Heading>
              <Text className="text-[14px] leading-[24px] text-black">
                Hello {username},
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                Please click on below link to login in your account.
              </Text>
            </Section>

            <Section className="my-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Login in my account
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
              this link, you can ignore this email. If you are concerned about your
              account&apos;s safety, please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

MagicLinkEmail.PreviewProps = {
  username: 'alanturing@email.com',
  link: `${baseUrl}/new-verification?token=${1234567890}`,
} as MagicLinkEmailProps;

export default MagicLinkEmail;
