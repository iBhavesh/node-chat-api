"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMedia = exports.getProfilePicture = exports.getMediaToken = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const jsonwebtoken_1 = require("jsonwebtoken");
const Chat_1 = __importDefault(require("../models/Chat"));
const User_1 = __importDefault(require("../models/User"));
const getMediaToken = (req, res) => {
    try {
        const jwt = (0, jsonwebtoken_1.sign)({ user: req.user, type: "MEDIA_TOKEN" }, process.env.SECURE_KEY, {
            expiresIn: "15m",
        });
        return res.json({ token: jwt });
    }
    catch (e) {
        return res.sendStatus(400);
    }
};
exports.getMediaToken = getMediaToken;
const getProfilePicture = async (req, res) => {
    try {
        const user = await User_1.default.findOne({
            email: req.params.userId,
        });
        if (!user)
            return res.status(400).send("User does not exist");
        if (!user.profilePicture)
            return res.sendStatus(400);
        await (0, promises_1.stat)(user.profilePicture);
        const file = (0, fs_1.createReadStream)(user.profilePicture);
        file.pipe(res);
    }
    catch (error) {
        if (error.message.includes("no such file or directory"))
            return res.status(400).send("File does not exist");
        return res.sendStatus(400);
    }
};
exports.getProfilePicture = getProfilePicture;
const getChatMedia = async (req, res) => {
    try {
        console.log(req.params);
        const message = await Chat_1.default.findById(req.params.messageId).findOne({
            isMedia: true,
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id },
            ],
        });
        if (!message)
            return res.status(400).send("Message does not exist");
        await (0, promises_1.stat)(message.content);
        message.deliveredAt = new Date();
        await message.save();
        const file = (0, fs_1.createReadStream)(message.content);
        file.pipe(res);
    }
    catch (error) {
        if (error.name === "CastError")
            return res.status(400).send("Message does not exist");
        if (error.message.includes("no such file or directory"))
            return res.status(400).send("File does not exist");
        return res.sendStatus(400);
    }
};
exports.getChatMedia = getChatMedia;
