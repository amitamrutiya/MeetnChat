import mongoose, { Document, Schema } from "mongoose";
import { chatSchema } from "./chat.model";

export interface User extends Document {
  email: string;
  password: string;
  username: string;
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
      match: [/^\S+@\S>>>>+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    username: {
      type: String,
      unique: true,
    },
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
