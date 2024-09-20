import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
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

    if (!user.isAcceptMessage) {
      return Response.json(
        {
          succes: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }
    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        succes: true,
        message: "Message send successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        succes: false,
        message: "Error sending message",
      },
      {
        status: 500,
      }
    );
  }
}
