"use server";

import db from "@repo/db/client";

type deleteGroupPropsType = {
  group_id: string;
};

export const deleteGroup = async ({ group_id }: deleteGroupPropsType) => {
  if (!group_id) {
    return { success: false, message: "Invalid data" };
  }

  const group = await db.group.delete({
    where: {
      id: group_id,
    },
  });

  await db.groupChat.deleteMany({
    where: {
      group_id,
    },
  });

  if (!group) {
    return { success: false, message: "Group not deleted" };
  }

  return { success: true, data: group, message: "Group deleted" };
};
