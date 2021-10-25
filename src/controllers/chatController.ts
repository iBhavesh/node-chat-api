import { RequestHandler } from "express";
import { MessagePort } from "worker_threads";
import Chat from "../models/Chat";
import User, { UserDocument } from "../models/User";

export const addMessage: RequestHandler = async (req, res) => {
  try {
    if (req.file) {
      req.body.content = req.file.path;
      req.body.isMedia = true;
    }

    req.body.sender = (req.user as UserDocument)._id;
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
    if (!user) return res.status(400).send("User does not exist");
    let option: { [key: string]: any } = {};
    if (req.query.isDelivered) {
      option.isDelivered = req.query.isDelivered;
    }
    const messages = await Chat.find({
      $or: [
        { receiver: (req.user as UserDocument)._id, sender: user._id },
        { sender: (req.user as UserDocument)._id, receiver: user._id },
      ],
      ...option,
    }).sort({ createdAt: -1 });
    messages.forEach((message) => {
      if (!message.deliveredAt || message.receiver === user.id) return;
      message.deliveredAt = new Date();
      message.save();
    });
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
        { receiver: (req.user as UserDocument)._id },
        { sender: (req.user as UserDocument)._id },
      ],
      ...option,
    }).sort({ createdAt: -1 });
    messages.forEach((message) => {
      if (
        !message.deliveredAt ||
        message.receiver === (req.user as UserDocument)._id
      )
        return;
      message.deliveredAt = new Date();
      message.save();
    });
    return res.send(messages);
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const deliverMessage: RequestHandler = async (req, res) => {
  try {
    console.log(req.body);
    const message = await Chat.findOne({ id: req.body._id });
    if (!message) return res.status(400).send("Message does not exist");
    message.isDelivered = true;
    message.deliveredAt = new Date();
    await message.save();
    return res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(400);
  }
};
