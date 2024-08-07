"use server";

import { z } from "zod";
import db from "@repo/db/client";
import { verifySchema } from "@repo/common";

type verifyCodeType = {
  username: string;
  code: z.infer<typeof verifySchema>;
};

export async function verifyCode(value: verifyCodeType) {
  const validatedFields = verifySchema.safeParse(value.code);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.message };
  }
  const { code } = validatedFields.data;
  const username = value.username;

  const user = await db.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return { success: false, message: "Invalid email or verification code" };
  }

  const isCodeValid = user.verifyCode === code;
  const isCodeExpired = new Date(user.verifyCodeExpiry ?? 0) > new Date();

  if (isCodeValid && isCodeExpired) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    return { success: true, message: "User verified successfully" };
  } else if (!isCodeExpired) {
    return { success: false, message: "Verification code has expired" };
  }
  return { success: false, message: "Invalid verification code" };
}
