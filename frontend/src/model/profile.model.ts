import mongoose, { Document, Schema } from "mongoose";

export interface Profile extends Document {
  name: string;
  email: string;
  profile_image: string;
  bio: string;
  phone_number: string;
  username: string;
  friends: mongoose.Schema.Types.ObjectId[];
  is_setup: boolean;
}

const profileSchema: Schema<Profile> = new Schema(
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
        ref: "Profile",
      },
    ],
    is_setup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProfileModel =
  (mongoose.models.Profile as mongoose.Model<Profile>) ||
  mongoose.model<Profile>("Profile", profileSchema);

export default ProfileModel;
