"use server";

import { db } from "@/lib/db";
import { usernameValidation } from "@/schemas/profileSchema";
import { z } from "zod";

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
