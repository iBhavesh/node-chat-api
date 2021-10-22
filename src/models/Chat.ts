import { model, Schema, ObjectId } from "mongoose";

type Chat = {
  content: string;
  isMedia: boolean;
  sender: ObjectId;
  receiver: ObjectId;
  createdAt: Date;
  deliveredAt: Date;
  isDelivered: boolean;
};

const chatSchema = new Schema<Chat>({
  content: {
    type: String,
    required: true,
    immutabe: true,
  },
  isMedia: {
    type: Boolean,
    required: true,
    immutable: true,
    default: false,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    immutable: true,
  },
  deliveredAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
});

export default model<Chat>("Chat", chatSchema);
