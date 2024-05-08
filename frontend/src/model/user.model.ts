import mongoose, { Document, Schema } from "mongoose";
import { chatSchema } from "./chat.model";

export interface User extends Document {
  email: string;
  password: string;
  username: string;
  fullname: string;
  profile_image: string;
  bio: string;
  phone_number: string;
  friends: mongoose.Schema.Types.ObjectId[];
  is_online?: boolean;
  is_verified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  chats: mongoose.Types.ObjectId[];
}

const userSchema: Schema<User> = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
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
      default: "0000000000",
      unique: true,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    is_online: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify Code Expiry is required"],
    },
    chats: [chatSchema],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
