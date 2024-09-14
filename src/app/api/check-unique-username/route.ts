import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { validateUsername } from "@/schemas/signUpScehma";

const UsernameQuerySchema = z.object({ username: validateUsername });

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validation
    const res = UsernameQuerySchema.safeParse(queryParam);

    if (!res.success) {
      const errors = res.error.format().username?._errors || [];
      return Response.json(
        {
          succes: false,
          message:
            errors?.length > 0 ? errors.join(". ") : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = res.data;
    const exists = await UserModel.findOne({ username, isVerified: true });
    if (exists) {
      return Response.json(
        {
          succes: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        succes: true,
        message: "Username available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        succes: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
