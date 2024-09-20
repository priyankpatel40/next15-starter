import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface TwoFactorProps {
  username: string;
  code: string;
}
const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const validityText = {
  ...text,
  margin: '0px',
  textAlign: 'center' as const,
};

const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;
const TwoFactorEmail = ({ username, code }: TwoFactorProps) => {
  const previewText = `Two Factor Authentication code`;

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
            <Section className="mt-[22px]">
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
              <Heading className="mx-0 my-[20px] p-0 text-center text-[24px] font-normal text-black">
                Your authentication code
              </Heading>
              <Text className="text-[14px] leading-[24px] text-black">
                Hello {username},
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                Your authentication code is below - enter it in your open browser window
                and we&apos;ll help you get signed in.
              </Text>
            </Section>

            <Section className="mb-[22px] mt-[12px] text-center">
              <Text className=" rounded px-5 py-1 text-center text-[16px] font-semibold text-black no-underline">
                Verification code
              </Text>
              <Text className=" rounded px-1 text-center text-[36px] font-semibold text-black no-underline">
                {code}
              </Text>
              <Text style={validityText}>(This code is valid for 10 minutes)</Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
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
