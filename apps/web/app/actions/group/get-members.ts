"use server";

import db from "@repo/db/client";

type GetMembersPropsType = {
  group_id: string;
};

export const getMembers = async ({ group_id }: GetMembersPropsType) => {
  if (!group_id) {
    return { success: false, message: "Invalid data" };
  }
  
  const group = await db.group.findUnique({
    where: {
      id: group_id,
    },
    select: {
      members: true,
    },
  });

  if (!group) {
    return { success: false, message: "Group not found" };
  }

  const users = await db.user.findMany({
    where: {
      id: {
        in: group.members,
      },
    },
  });

  if (!users) {
    return { success: false, message: "No members found" };
  }

  return { success: true, data: users, message: "Members fetched" };
};
