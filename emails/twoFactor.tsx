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

interface TwoFactorProps {
  username: string;
  code: string;
}

const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;
const app_name = process.env.APP_NAME || 'Your Company';
const TwoFactorEmail = ({ username, code }: TwoFactorProps) => {
  const previewText = `Two Factor Authentication code`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[22px]">
              <Img
                src={`${baseUrl}small-light.png`}
                width="60"
                height="60"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>

            <Section>
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
                Your authentication code
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                Hello {username},
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                Your authentication code is below - enter it in your open browser window
                and we&apos;ll help you get signed in.
              </Text>
            </Section>

            <Section className="text-center mt-[12px] mb-[22px]">
              <Text className=" rounded text-black text-[16px] font-semibold no-underline text-center px-5 py-1">
                Verification code
              </Text>
              <Text className=" rounded text-black text-[36px] font-semibold no-underline text-center px-1">
                {code}
              </Text>
              <Text style={validityText}>(This code is valid for 10 minutes)</Text>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This was intended for <span className="text-black">{username}</span>. If you
              did not request a two factor authentication code, please ignore this email
              or reply to let us know. This two factor authentication code is only valid
              for the next 10 minutes.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

TwoFactorEmail.PreviewProps = {
  username: 'alanturing',
  link: `${baseUrl}/new-password?token=${1234567890}`,
  code: '123456',
} as TwoFactorProps;

export default TwoFactorEmail;
const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};
const verifyText = {
  ...text,
  margin: 0,
  fontWeight: 'bold',
  textAlign: 'center' as const,
};

const codeText = {
  ...text,
  fontWeight: 'bold',
  fontSize: '36px',
  margin: '10px 0',
  textAlign: 'center' as const,
};

const validityText = {
  ...text,
  margin: '0px',
  textAlign: 'center' as const,
};

const verificationSection = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
