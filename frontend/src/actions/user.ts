import { db } from "@/lib/db";
import { User } from "@prisma/client";

export async function getUserByIdentifier(
  identifier: string
): Promise<User | null> {
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

export async function getUserById(id: string): Promise<User | null> {
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
