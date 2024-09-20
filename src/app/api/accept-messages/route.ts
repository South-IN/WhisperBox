import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userData: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        succes: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const id = userData._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { isAcceptMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          succes: false,
          message: "failed to update accept-message state",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        succes: true,
        message: "accept-message state updated sucessfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update accept-message state");
    return Response.json(
      {
        succes: false,
        message: "failed to update accept-message state",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userData: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        succes: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const id = userData._id;
  try {
    const foundUser = await UserModel.findById(id);
    if (!foundUser) {
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
    return Response.json(
      {
        succes: true,
        isAcceptingMessages: foundUser.isAcceptMessage,
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.log("failed get accepting message state");
    return Response.json(
      {
        succes: false,
        message: "failed to get accept-message state",
      },
      {
        status: 500,
      }
    );
  }
}
