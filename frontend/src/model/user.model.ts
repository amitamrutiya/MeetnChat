import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const userModel =  mongoose.model("User", userSchema);

export default userModel;
