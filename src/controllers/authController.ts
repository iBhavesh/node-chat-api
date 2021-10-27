import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

import User from "../models/User";

export const login: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User does not exist");
    const isValid = await bcrypt.compare(req.body.password, user.password!);
    if (isValid) {
      const userJson = {
        _id: user._id,
        email: user.email,
      };
      return res.status(200).json(generateTokens(userJson));
    }
    return res.status(400).send("Username/password invalid");
  } catch (e) {
    console.log(e);
  }
  return res.sendStatus(400);
};

export const signup: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = new User(req.body);
    user.password = await bcrypt.hash(user.password!, 10);
    await user.save();
    const userJson = {
      _id: user._id,
      email: user.email,
    };

    return res.status(201).json(generateTokens(userJson));
  } catch (e) {}
  return res.status(400).json({ message: "An error occured" });
};

export const refreshToken: RequestHandler = async (req, res) => {
  try {
    if (!req.body["refresh_token"])
      return res.status(400).send("Refresh Token is required");
    const data = (await jwt.verify(
      req.body["refresh_token"],
      process.env.SECURE_KEY!
    )) as JwtPayload;
    delete data.iat;
    delete data.exp;
    return res.status(200).json(generateTokens(data));
  } catch (e: any) {
    if (e instanceof TokenExpiredError)
      return res.status(400).send("Refresh Token expired");
    else if (e.message === "invalid signature") {
      return res.status(400).send("Refresh Token not valid");
    } else return res.status(400).send("Refresh Token not valid");
  }
};

const generateTokens = (payload: { [key: string]: any }) => {
  const access_token = jwt.sign(
    { user: payload, type: "ACCESS_TOKEN" },
    process.env.SECURE_KEY!,
    {
      expiresIn: "15m",
    }
  );
  const refresh_token = jwt.sign(
    { user: payload, type: "REFRESH_TOKEN" },
    process.env.SECURE_KEY!,
    {
      expiresIn: "10d",
    }
  );
  return { access_token, refresh_token };
};
