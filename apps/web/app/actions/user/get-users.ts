"use server";

import db from "@repo/db/client";

type getUsersType = {
  page: number;
  pageSize: number;
};

export async function getUsers({ page, pageSize }: getUsersType) {
  try {
    // Calculate the offset
    const offset = (page - 1) * pageSize;

    // Fetch paginated list of users
    const users = await db.user.findMany({
      skip: offset,
      take: pageSize,
    });

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}
