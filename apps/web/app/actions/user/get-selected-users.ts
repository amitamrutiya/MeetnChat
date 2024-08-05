"use server";

import db from "@repo/db/client";

export async function getSelectedUsers({ userList }: { userList: string[] }) {
  console.log("userList", userList);
  try {
    const user = await db.user.findMany({
      where: {
        id: {
          in: userList,
        },
      },
    });
    return { success: true, data: user, message: "Users fetched successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error fetching users" };
  }
}
