import connectDB from "@/config/database";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/profileSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    console.log("result", queryParam);
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("result", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      is_verified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in check-username-unique", error);
    return Response.json(
      {
        success: false,
        message: "Error in check-username-unique",
      },
      {
        status: 500,
      }
    );
  }
}
