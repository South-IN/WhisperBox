import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

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
  const id = new mongoose.Types.ObjectId(userData._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
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
        messages: user[0].messages,
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
        message: "Cannot get messages",
      },
      {
        status: 500,
      }
    );
  }
}
