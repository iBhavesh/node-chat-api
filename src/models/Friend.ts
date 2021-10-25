import { Document, model, ObjectId, Schema } from "mongoose";

interface FriendDocument extends Document {
  user1: ObjectId;
  user2: ObjectId;
  isAccepted: boolean;
  createdAt: Date;
}

const friendSchema = new Schema<FriendDocument>({
  user1: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  user2: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    immutable: true,
  },
});

export default model<FriendDocument>("Friend", friendSchema);
