import { RequestHandler } from "express";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { sign } from "jsonwebtoken";
import Chat from "../models/Chat";
import User, { UserDocument } from "../models/User";

export const getMediaToken: RequestHandler = (req, res) => {
  try {
    const jwt = sign(
      { user: req.user, type: "MEDIA_TOKEN" },
      process.env.SECURE_KEY!,
      {
        expiresIn: "15m",
      }
    );
    return res.json({ token: jwt });
  } catch (e) {
    return res.sendStatus(400);
  }
};

export const getProfilePicture: RequestHandler = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.userId,
    });
    if (!user) return res.status(400).send("User does not exist");
    if (!user.profilePicture) return res.sendStatus(400);
    await stat(user.profilePicture);
    const file = createReadStream(user.profilePicture);
    file.pipe(res);
  } catch (error: any) {
    if ((error.message as string).includes("no such file or directory"))
      return res.status(400).send("File does not exist");
    return res.sendStatus(400);
  }
};

export const getChatMedia: RequestHandler = async (req, res) => {
  try {
    console.log(req.params);
    const message = await Chat.findById(req.params.messageId).findOne({
      isMedia: true,
      $or: [
        { sender: (req.user as UserDocument)._id },
        { receiver: (req.user as UserDocument)._id },
      ],
    });
    if (!message) return res.status(400).send("Message does not exist");
    await stat(message.content);
    message.deliveredAt = new Date();
    await message.save();
    const file = createReadStream(message.content);
    file.pipe(res);
  } catch (error: any) {
    if ((error.name as string) === "CastError")
      return res.status(400).send("Message does not exist");
    if ((error.message as string).includes("no such file or directory"))
      return res.status(400).send("File does not exist");
    return res.sendStatus(400);
  }
};
