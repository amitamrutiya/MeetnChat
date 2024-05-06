import mongoose, { Document, Schema } from "mongoose";
import { chatSchema } from "./chat.model";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  profile_image: string;
  bio: string;
  phone_number: string;
  username: string;
  friends: mongoose.Schema.Types.ObjectId[];
  is_setup: boolean;
  is_online: boolean;
  is_verified: boolean;
  chats: mongoose.Types.ObjectId[];
}

const userSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/^\S+@\S>>>>+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profile_image: {
      type: String,
    },
    bio: {
      type: String,
      default: "Hey there! I am available on ChatApp",
    },
    phone_number: {
      type: String,
      match: [/^\d{10}$/, "Please enter a valid phone number"],
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    is_setup: {
      type: Boolean,
      default: false,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    chats: [chatSchema],
  },
  { timestamps: true }
);

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default userModel;
