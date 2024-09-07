import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationMail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Whisper box Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email reponse sent" };
  } catch (error) {
    console.log("Error sending verification email", error);
    return { success: false, message: "ailed to send verification email" };
  }
}
