"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverMessage = exports.getAllMessages = exports.getMessages = exports.addMessage = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const User_1 = __importDefault(require("../models/User"));
const addMessage = async (req, res) => {
    try {
        if (req.file) {
            req.body.content = req.file.path;
            req.body.isMedia = true;
        }
        req.body.sender = req.user._id;
        const receiver = await User_1.default.findOne({ email: req.body.receiver });
        req.body.receiver = receiver?._id;
        const chat = new Chat_1.default(req.body);
        await chat.save();
        return res.json({ _id: chat._id });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Something went wrong");
    }
};
exports.addMessage = addMessage;
const getMessages = async (req, res) => {
    try {
        const user = await User_1.default.findOne({ email: req.params.userId });
        if (!user)
            return res.status(400).send("User does not exist");
        let option = {};
        if (req.query.isDelivered) {
            option.isDelivered = req.query.isDelivered;
        }
        const messages = await Chat_1.default.find({
            $or: [
                { receiver: req.user._id, sender: user._id },
                { sender: req.user._id, receiver: user._id },
            ],
            ...option,
        }).sort({ createdAt: -1 });
        messages.forEach((message) => {
            if (!message.deliveredAt || message.receiver === user.id)
                return;
            message.deliveredAt = new Date();
            message.save();
        });
        return res.send(messages);
    }
    catch (error) {
        return res.sendStatus(400);
    }
};
exports.getMessages = getMessages;
const getAllMessages = async (req, res) => {
    try {
        let option = {};
        if (req.query.isDelivered) {
            option.isDelivered = req.query.isDelivered;
        }
        const messages = await Chat_1.default.find({
            $or: [
                { receiver: req.user._id },
                { sender: req.user._id },
            ],
            ...option,
        }).sort({ createdAt: -1 });
        messages.forEach((message) => {
            if (!message.deliveredAt ||
                message.receiver === req.user._id)
                return;
            message.deliveredAt = new Date();
            message.save();
        });
        return res.send(messages);
    }
    catch (error) {
        return res.sendStatus(400);
    }
};
exports.getAllMessages = getAllMessages;
const deliverMessage = async (req, res) => {
    try {
        const message = await Chat_1.default.findById(req.params.messageId);
        if (!message)
            return res.status(400).send("Message Not Found");
        if (req.user._id !== message.receiver)
            return res.sendStatus(401);
        if (!message)
            return res.status(400).send("Message does not exist");
        message.isDelivered = true;
        message.deliveredAt = new Date();
        await message.save();
        return res.sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(400);
    }
};
exports.deliverMessage = deliverMessage;
