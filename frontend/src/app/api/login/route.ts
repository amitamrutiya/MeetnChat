import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { signInSchema } from "@/schemas/signinSchema";
import { getUserByEmail } from "@/actions/user";
import { User } from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const values = await req.json();

  const validatedFields = signInSchema.safeParse(values);

  if (!validatedFields.success) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: validatedFields.error.message,
      }),
      {
        status: 400,
      }
    );
  }

  const { identifier, password } = validatedFields.data;

  const existingUser: User = await getUserByEmail(identifier);
  if (
    !existingUser ||
    !existingUser.email ||
    !existingUser.username ||
    !existingUser.password
  ) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Email does not exist!",
      }),
      {
        status: 404,
      }
    );
  }

  if (!existingUser.is_verified) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Email is not verified!",
      }),
      {
        status: 401,
      }
    );
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Invalid password",
      }),
      {
        status: 401,
      }
    );
  }

  try {
    await signIn("credentials", {
      identifier,
      password,
    });
    return new NextResponse(
      JSON.stringify({
        user: existingUser,
        message: "User logged in",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthSignInError":
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: "OAuth sign in not supported",
            }),
            {
              status: 400,
            }
          );
        case "OAuthCallbackError":
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: "OAuth callback error",
            }),
            {
              status: 400,
            }
          );
        case "CredentialsSignin":
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: "Invalid credentials",
            }),
            {
              status: 401,
            }
          );

        default:
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: "Unknown error",
            }),
            {
              status: 500,
            }
          );
      }
    }
    throw error;
  }
}
