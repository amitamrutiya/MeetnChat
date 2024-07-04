"use server";

import { usernameValidation } from "@repo/common";
import { z } from "zod";
import db from "@repo/db/client";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function checkUsernameUnique(
  values: z.infer<typeof UsernameQuerySchema>
) {
  const validatedFields = UsernameQuerySchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.message };
  }
  const { username } = validatedFields.data;

  const existingVerifiedUser = await db.user.findFirst({
    where: {
      username,
      emailVerified: {
        not: null,
      },
    },
  });

  if (existingVerifiedUser) {
    return { success: false, message: "Username already exists" };
  }

  return { success: true, message: "username is unique" };
}
