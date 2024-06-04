import { Document, Schema, model, models, Types } from "mongoose";

export interface Chat extends Document {
  sender_id: Schema.Types.ObjectId;
  receiver_id: Schema.Types.ObjectId;
  message: string;
}

const chatSchema = new Schema<Chat>(
  {
    sender_id: {
      type: Types.ObjectId,
      required: true,
    },
    receiver_id: {
      type: Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatModel = models.chatModel || model("chat", chatSchema);

export default ChatModel;
