import { RequestHandler } from "express";
import Chat from "../models/Chat";
import User from "../models/User";

export const addMessage: RequestHandler = async (req, res) => {
  try {
    req.body.sender = (req.user as any)._id;
    const receiver = await User.findOne({ email: req.body.receiver });
    req.body.receiver = receiver?._id;
    const chat = new Chat(req.body);
    await chat.save();
    return res.json({ _id: chat._id });
  } catch (error) {
    console.log(error);

    return res.status(400).send("Something went wrong");
  }
};

export const getMessages: RequestHandler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.userId });
    let option: { [key: string]: any } = {};
    if (req.query.isDelivered) {
      option.isDelivered = req.query.isDelivered;
    }
    const messages = await Chat.find({
      $or: [
        { receiver: (req.user as any)._id, sender: user?._id },
        { sender: (req.user as any)._id, receiver: user?._id },
      ],
      ...option,
    }).sort({ createdAt: -1 });
    return res.send(messages);
  } catch (error) {
    return res.sendStatus(400);
  }
};
export const getAllMessages: RequestHandler = async (req, res) => {
  try {
    let option: { [key: string]: any } = {};
    if (req.query.isDelivered) {
      option.isDelivered = req.query.isDelivered;
    }
    const messages = await Chat.find({
      $or: [
        { receiver: (req.user as any)._id },
        { sender: (req.user as any)._id },
      ],
      ...option,
    }).sort({ createdAt: -1 });
    return res.send(messages);
  } catch (error) {
    return res.sendStatus(400);
  }
};
