import connectDB from "@/config/database";
import UserModel from "@/model/user.model";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";

const VerifyCodeQuerySchema = z.object({
  code: verifySchema,
});

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, code }: { username: string; code: string } =
      await request.json();
    console.log("username", username, "code", code);
    const decodedUsername = decodeURIComponent(username);
    const result = VerifyCodeQuerySchema.safeParse({ code: { code } });
    console.log("result", result.error);
    if (!result.success) {
      const codeErrors = result.error.format().code?._errors || [];
      console.log("codeErrors", codeErrors);
      return Response.json(
        {
          success: false,
          message:
            codeErrors?.length > 0 ? codeErrors.join(", ") : "Invalid code",
        },
        {
          status: 400,
        }
      );
    }
    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeExpired) {
      user.is_verified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired, please signup againt to get a new code",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Code Invalid",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.log("Error in verify-code", error);
    return Response.json(
      {
        success: false,
        message: "Error in verify-code",
      },
      {
        status: 500,
      }
    );
  }
}
