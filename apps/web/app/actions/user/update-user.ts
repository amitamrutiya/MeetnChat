"use server";

import db from "@repo/db/client";

type updateUserType = {
  id: string;
  name: string;
  username: string;
  bio: string;
  phone_number: string;
  image: string;
};

export async function updateUser({ id, name, username, bio, phone_number, image }: updateUserType) {
  try {
    // Update the user's data
    const user = await db.user.update({
      where: { id },
      data: {
        name,
        username,
        bio,
        phone_number,
        image,
      },
    });

    return {
      success: true,
      data: user,
      message: "User updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Failed to update user",
    };
  }
}
