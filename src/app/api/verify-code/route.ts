import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username); //use when extracting data from uri
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          succes: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    const isValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
    if (isValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          succes: true,
          message: "User verified",
        },
        {
          status: 200,
        }
      );
    } else if (isCodeExpired) {
      return Response.json(
        {
          succes: false,
          message: "Verification code expired",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          succes: false,
          message: "Incorrect Verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        succes: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
