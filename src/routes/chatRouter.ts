import { Router } from "express";
import multer from "multer";

import * as ChatController from "../controllers/chatController";
import { storage } from "../utils/helpers";

export const chatRouter = Router();

chatRouter.post(
  "/message",
  multer({ storage: storage }).single("file"),
  ChatController.addMessage
);
chatRouter.get("/messages", ChatController.getAllMessages);
chatRouter.get("/messages/:userId", ChatController.getMessages);
chatRouter.get("/messages/:userId", ChatController.deliverMessage);
chatRouter.patch("/message/deliver", ChatController.deliverMessage);
