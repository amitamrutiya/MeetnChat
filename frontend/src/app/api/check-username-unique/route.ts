import connectDB from "@/config/database";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/profileSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: z.string(),
});

export default async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid query params",
        },
        {
          status: 400,
        }
      );
    }
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
