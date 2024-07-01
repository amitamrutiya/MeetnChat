"use server";

import { db } from "@/lib/db";

export async function getUsers() {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}
