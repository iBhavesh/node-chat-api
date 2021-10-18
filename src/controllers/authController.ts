import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";

export const login: RequestHandler = async (req, res) => {
  const user = new User(req.body);
  console.log("s");
  user.save().catch((e) => {
    console.log(e);
  });
  return res.send(user);
};

export const signup: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = new User(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    const token = jwt.sign(
      { email: user.email, type: "ACCESS_TOKEN" },
      process.env.SECURE_KEY!,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { email: user.email, type: "REFRESH_TOKEN" },
      process.env.SECURE_KEY!,
      {
        expiresIn: "10d",
      }
    );
    return res
      .status(201)
      .json({ access_token: token, refresh_token: refreshToken });
  } catch (e) {}
  return res.status(400).json({ message: "An error occured" });
};
export const refreshToken: RequestHandler = (req, res) => {
  try {
    const data = jwt.verify(req.body["refresh_token"], process.env.SECURE_KEY!);
    console.log(data);
  } catch (e) {
    console.log();
  }
  return res.send("REFRESH TOKEN");
};
