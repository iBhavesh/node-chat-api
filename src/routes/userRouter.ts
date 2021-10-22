import { Router } from "express";
import multer from "multer";

import * as userController from "../controllers/userController";
import { imageFilter, storage } from "../utils/helpers";

export const userRouter = Router();

userRouter.get("/:email", userController.getUser);
userRouter.patch("/name", userController.updateName);
userRouter.post(
  "/profile-picture",
  multer({ storage: storage, fileFilter: imageFilter }).single("file"),
  userController.updateProfilePicture
);
