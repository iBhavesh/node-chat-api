import { RequestHandler } from "express";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { sign } from "jsonwebtoken";
import User from "../models/User";

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
    await stat(user.profilePicture + ".jpg");
    const file = createReadStream(user.profilePicture + "jpg");
    file.pipe(res);
  } catch (error: any) {
    if ((error.message as string).includes("no such file or directory"))
      return res.status(400).send("File does not exist");
    return res.sendStatus(400);
  }
};
