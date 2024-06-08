"use server";

import connectDB from "@/config/database";
import UserModel from "@/model/user.model";

export async function getUserByEmail(identifier: string) {
  try {
    await connectDB();
    const User = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    return User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    await connectDB();
    const User = await UserModel.findById(id);
    return User;
  } catch (error) {
    console.log(error);
    return null;
  }
}
