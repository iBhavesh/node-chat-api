"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateProfilePicture = exports.getProfilePicture = exports.updateName = exports.getUser = void 0;
const bcrypt_1 = require("bcrypt");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const User_1 = __importDefault(require("../models/User"));
const getUser = async (req, res) => {
    try {
        const user = await User_1.default.findOne({ email: req.params.email });
        if (!user)
            return res.status(400).send("user does not exist");
        return res.send(user);
    }
    catch (error) {
        return res.sendStatus(400);
    }
};
exports.getUser = getUser;
const updateName = async (req, res) => {
    if (!req.body.name)
        return res.status(400).send("Name is required");
    try {
        await User_1.default.updateOne({ email: req.user.email }, { name: req.body.name });
        return res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
    }
    return res.sendStatus(400);
};
exports.updateName = updateName;
const getProfilePicture = async (req, res) => {
    try {
        const user = await User_1.default.findOne({
            email: req.user.email,
        });
        if (!user)
            return res.status(400).send("User does not exist");
        if (!user.profilePicture)
            return res.sendStatus(400);
        const file = (0, fs_1.createReadStream)(user.profilePicture);
        file.pipe(res);
    }
    catch (error) {
        return res.sendStatus(400);
    }
};
exports.getProfilePicture = getProfilePicture;
const updateProfilePicture = async (req, res) => {
    if (!req.file)
        return res.status(400).send("Image is required");
    try {
        const user = await User_1.default.findOne({
            email: req.user.email,
        });
        if (!user)
            return res.status(400).send("User does not exist");
        const oldPath = user.profilePicture;
        user.profilePicture = req.file.path;
        await user.save();
        await (0, promises_1.rm)(oldPath);
        return res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
};
exports.updateProfilePicture = updateProfilePicture;
const updatePassword = async (req, res) => {
    try {
        const user = await User_1.default.findOne({
            email: req.user.email,
        });
        if (!user)
            return res.status(400).send("User does not exist");
        const isValid = await (0, bcrypt_1.compare)(req.body["old-password"], req.body["new-password"]);
        if (!isValid)
            return res.status(400).send("Password is incorrect");
        user.password = await (0, bcrypt_1.hash)(req.body["new-password"], 10);
        await user.save();
        return res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
};
exports.updatePassword = updatePassword;
