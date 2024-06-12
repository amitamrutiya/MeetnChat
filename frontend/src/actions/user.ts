"use server";

import { db } from "@/lib/db";

export async function getUserByIdentifier(identifier: string) {
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

export async function getUserById(id: string) {
  try {
    const User = await db.user.findUnique({
      where: {
        id,
      },
    });
    return User;
  } catch (error) {
    console.log(error);
    return null;
  }
}
