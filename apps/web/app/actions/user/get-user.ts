"use server";

import db from "@repo/db/client";
import { User } from "@prisma/client";

export async function getUserByIdentifier(identifier: string): Promise<User | null> {
  try {
    const user = await db.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserById({ user_id }: { user_id: string }): Promise<User | null> {
  try {
    const User = await db.user.findUnique({
      where: {
        id: user_id,
      },
    });
    return User;
  } catch (error) {
    console.log(error);
    return null;
  }
}
