import { Router } from "express";
import Passport from "passport";

import * as MediaController from "../controllers/mediaController";
import "../utils/auth";

export const mediaRouter = Router();

mediaRouter.get(
  "/token",
  Passport.authenticate("jwt", { session: false }),
  MediaController.getMediaToken
);

mediaRouter.use(Passport.authenticate("media", { session: false }));

mediaRouter.get("/profile-picture/:userId", MediaController.getProfilePicture);
mediaRouter.get("/chat/:messageId", MediaController.getChatMedia);
