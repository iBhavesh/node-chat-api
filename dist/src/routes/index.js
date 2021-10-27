"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authRouter_1 = require("./authRouter");
const userRouter_1 = require("./userRouter");
const mediaRouter_1 = require("./mediaRouter");
const chatRouter_1 = require("./chatRouter");
require("../utils/auth");
const zlib_1 = require("zlib");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const promises_1 = require("stream/promises");
exports.router = (0, express_1.Router)();
exports.router.use("/auth", authRouter_1.authRouter);
exports.router.use("/media", mediaRouter_1.mediaRouter);
exports.router.use(passport_1.default.authenticate("jwt", { session: false }));
exports.router.use("/user", userRouter_1.userRouter);
exports.router.use(chatRouter_1.chatRouter);
exports.router.get("/file", async (req, res) => {
    const hash = (0, crypto_1.createHash)("sha256");
    hash.update("MYSUPERSECRET");
    const key = hash.digest();
    const iv = (0, crypto_1.randomBytes)(16);
    const gzip = (0, zlib_1.createGzip)();
    const file = "uploads/163472609890445.mp4";
    const readStream = (0, fs_1.createReadStream)(file);
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", key, iv);
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'inline; filename="' + file + '"');
    readStream.pipe(res);
});
let iv;
const hash = (0, crypto_1.createHash)("sha256");
hash.update("MYSUPERSECRET");
const key = hash.digest();
const compress = async (file) => {
    iv = (0, crypto_1.randomBytes)(16).toString("hex");
    const gzip = (0, zlib_1.createGzip)();
    const readStream = (0, fs_1.createReadStream)(file);
    const writeStream = (0, fs_1.createWriteStream)(file + ".enc");
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", key, iv);
    try {
        await (0, promises_1.pipeline)(readStream, gzip, cipher, writeStream);
        return unCompress(file + ".enc", cipher.getAuthTag());
    }
    catch (e) {
        console.log(e);
    }
};
const unCompress = async (file, authTag) => {
    const gzip = (0, zlib_1.createUnzip)();
    const readStream = (0, fs_1.createReadStream)(file);
    const writeStream = (0, fs_1.createWriteStream)(file.replace(".enc", "").replace("/", "/N"));
    const cipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", key, iv);
    cipher.setAuthTag(authTag);
    try {
        return await (0, promises_1.pipeline)(readStream, cipher, gzip, writeStream);
    }
    catch (e) {
        console.log(e);
    }
};
