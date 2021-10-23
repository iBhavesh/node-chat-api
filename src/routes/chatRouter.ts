import { Router } from "express";

import * as ChatController from "../controllers/chatController";

export const chatRouter = Router();

chatRouter.post("/message", ChatController.addMessage);
chatRouter.get("/messages", ChatController.getAllMessages);
chatRouter.get("/messages/:userId", ChatController.getMessages);
