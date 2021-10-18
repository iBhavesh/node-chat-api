import { Router } from "express";
import User from "../models/User";
import { authRouter } from "./authRouter";

export const router = Router();

router.use("/auth", authRouter);

router.get("/user/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  return res.send(user);
});
