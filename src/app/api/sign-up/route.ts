import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationMail } from "@/helpers/sendVerificationMail";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const userVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (userVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const userVerifiedByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (userVerifiedByEmail) {
      if (userVerifiedByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists",
          },
          { status: 200 }
        );
      } else {
        const hash = await bcrypt.hash(password, 10);
        userVerifiedByEmail.password = hash;
        userVerifiedByEmail.verifyCode = verifyCode;
        userVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await userVerifiedByEmail.save();
      }
    } else {
      const hash = await bcrypt.hash(password, 10);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);

      const user = new UserModel({
        username,
        email,
        password: hash,
        verifyCode,
        verifyCodeExpiry: expiry,
        isVerified: false,
        isAcceptMessage: true,
        messages: [],
      });

      await user.save();
    }

    const emailReponse = await sendVerificationMail(
      email,
      username,
      verifyCode
    );

    if (!emailReponse.success) {
      return Response.json(
        { success: false, message: emailReponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        succes: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
