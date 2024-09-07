import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Text,
  Section,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmailProps({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily={"Verdana"}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your Verification code : {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering to whisper box. your email Verification
            code :
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
      </Section>
    </Html>
  );
}
