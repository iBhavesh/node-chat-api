import { Document, model, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password?: string;
  name: string;
  profilePicture: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    required: true,
    immutable: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default model<UserDocument>("User", userSchema);
