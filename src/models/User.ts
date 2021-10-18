import { model, Schema } from "mongoose";

type User = {
  email: string;
  password: string;
  name?: string;
};

const userSchema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    requried: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
});

export default model<User>("User", userSchema);
