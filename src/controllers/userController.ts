import { compare, hash } from "bcrypt";
import { RequestHandler } from "express";
import { createReadStream } from "fs";
import { rm } from "fs/promises";
import User, { UserDocument } from "../models/User";

export const getUser: RequestHandler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(400).send("user does not exist");
    return res.send(user);
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const updateName: RequestHandler = async (req, res) => {
  if (!req.body.name) return res.status(400).send("Name is required");
  try {
    await User.updateOne(
      { email: (req.user as UserDocument).email },
      { name: req.body.name }
    );
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
  }
  return res.sendStatus(400);
};

export const getProfilePicture: RequestHandler = async (req, res) => {
  try {
    const user = await User.findOne({
      email: (req.user as UserDocument).email,
    });
    if (!user) return res.status(400).send("User does not exist");
    if (!user.profilePicture) return res.sendStatus(400);
    const file = createReadStream(user.profilePicture);
    file.pipe(res);
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const updateProfilePicture: RequestHandler = async (req, res) => {
  if (!req.file) return res.status(400).send("Image is required");
  try {
    const user = await User.findOne({
      email: (req.user as UserDocument).email,
    });
    if (!user) return res.status(400).send("User does not exist");
    const oldPath = user.profilePicture;
    user.profilePicture = req.file.path;
    await user.save();
    await rm(oldPath);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export const updatePassword: RequestHandler = async (req, res) => {
  try {
    const user = await User.findOne({
      email: (req.user as UserDocument).email,
    });
    if (!user) return res.status(400).send("User does not exist");
    const isValid = await compare(
      req.body["old-password"],
      req.body["new-password"]
    );
    if (!isValid) return res.status(400).send("Password is incorrect");
    user.password = await hash(req.body["new-password"], 10);
    await user.save();
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};
