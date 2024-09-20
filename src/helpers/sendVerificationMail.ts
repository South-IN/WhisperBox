import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationMail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
    });
    const emailHtml = `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body>
          <h2>Hello ${username},</h2>
          <p>Thank you for registering on Whisper Box. Your email verification code is:</p>
          <h3>${verifyCode}</h3>
          <p>This code is valid for one hour.</p>
          <p>Best regards,</p>
          <p>Whisper Box Team</p>
        </body>
      </html>
    `;

    let response = await transporter.sendMail({
      from: `${process.env.MY_MAIL}`,
      to: email,
      subject: "whisper box verification code",
      html: emailHtml,
    });
    return { success: true, message: "Verification email reponse sent" };
  } catch (error) {
    console.log("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
