"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { getUserByIdentifier } from "../user/get-user";
import { signInSchema } from "@repo/common";
import { signIn } from "next-auth/react";

export async function login(values: z.infer<typeof signInSchema>) {
  const validatedFields = signInSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.message };
  }
  const { identifier, password } = validatedFields.data;

  const existingUser = await getUserByIdentifier(identifier);
  if (!existingUser || !existingUser.email || !existingUser.username || !existingUser.password) {
    return { success: false, message: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    return {
      success: false,
      message: "Email not verified. First verify email",
    };
  }
  const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordCorrect) {
    return {
      success: false,
      message: "Invalid credentials",
    };
  }
  try {
    await signIn("credentials", {
      identifier,
      password,
    });
    return { success: true, message: "User Login" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthSignInError":
          return { success: false, message: "OAuth sign in not supported" };
        case "OAuthCallbackError":
          return { success: false, message: "OAuth callback not supported" };
        case "CredentialsSignin":
          return { success: false, message: "Invalid credentials" };
        default:
          return {
            success: false,
            message: "An unknown error occurred" + error,
          };
      }
    }
    throw error;
  }
}
