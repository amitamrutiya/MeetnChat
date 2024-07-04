"use server";

import db from "@repo/db/client";

export async function getUsers() {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}
