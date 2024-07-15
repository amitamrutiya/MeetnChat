"use server";

import db from "@repo/db/client";
import bcrypt from "bcryptjs";

type updateUserPasswordProps = {
  userId: string;
  password: string;
};

export async function updateUserPassword({ userId, password }: updateUserPasswordProps) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const response = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  if (response) {
    return { success: true, message: "Password updated successfully" };
  }

  return { success: false, message: "Password update failed" };
}
