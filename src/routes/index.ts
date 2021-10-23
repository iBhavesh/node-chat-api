import { Router } from "express";
import passport from "passport";

import { authRouter } from "./authRouter";
import { userRouter } from "./userRouter";
import { mediaRouter } from "./mediaRouter";
import { chatRouter } from "./chatRouter";

import "../utils/auth";
import { createGzip, createUnzip } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";
import { pipeline } from "stream/promises";

export const router = Router();

router.use("/auth", authRouter);

router.use("/media", mediaRouter);

router.use(passport.authenticate("jwt", { session: false }));

router.use("/user", userRouter);
router.use(chatRouter);

router.get("/file", async (req, res) => {
  const hash = createHash("sha256");
  hash.update("MYSUPERSECRET");
  const key = hash.digest();
  const iv = randomBytes(16);
  const gzip = createGzip();
  const file = "uploads/163472609890445.mp4";
  const readStream = createReadStream(file);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", 'inline; filename="' + file + '"');
  readStream.pipe(res);
});

let iv: string;
const hash = createHash("sha256");
hash.update("MYSUPERSECRET");
const key = hash.digest();

const compress = async (file: string) => {
  iv = randomBytes(16).toString("hex");

  const gzip = createGzip();
  const readStream = createReadStream(file);
  const writeStream = createWriteStream(file + ".enc");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  try {
    await pipeline(readStream, gzip, cipher, writeStream);
    return unCompress(file + ".enc", cipher.getAuthTag());
  } catch (e) {
    console.log(e);
  }
};

const unCompress = async (file: string, authTag: Buffer) => {
  const gzip = createUnzip();
  const readStream = createReadStream(file);
  const writeStream = createWriteStream(
    file.replace(".enc", "").replace("/", "/N")
  );
  const cipher = createDecipheriv("aes-256-gcm", key, iv);
  cipher.setAuthTag(authTag);
  try {
    return await pipeline(readStream, cipher, gzip, writeStream);
  } catch (e) {
    console.log(e);
  }
};
