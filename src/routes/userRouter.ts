import { Router } from "express";
import multer from "multer";

import * as UserController from "../controllers/userController";
import { imageFilter, storage } from "../utils/helpers";
import { updatePasswordValidator } from "../utils/validators";

export const userRouter = Router();

userRouter.patch("/name", UserController.updateName);
userRouter
  .route("/profile-picture")
  .get(UserController.getProfilePicture)
  .post(
    multer({ storage: storage, fileFilter: imageFilter }).single("file"),
    UserController.updateProfilePicture
  );
userRouter.put(
  "/password",
  updatePasswordValidator,
  UserController.updatePassword
);
userRouter.get("/:email", UserController.getUser);
