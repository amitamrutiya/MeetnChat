import mongoose, { Document, Schema } from "mongoose";

export interface Chat extends Document {
  sender_id: mongoose.Schema.Types.ObjectId;
  receiver_id: mongoose.Schema.Types.ObjectId;
  message: string;
}

export const chatSchema: Schema<Chat> = new Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatModel =
  (mongoose.models.Chat as mongoose.Model<Chat>) ||
  mongoose.model<Chat>("Chat", chatSchema);

export default chatModel;
