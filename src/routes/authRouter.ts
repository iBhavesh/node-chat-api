import { Router } from "express";

import * as authController from "../controllers/authController";
import { loginValidator, signupValidator } from "../utils/validators";

export const authRouter = Router();

authRouter.post("/login", loginValidator, authController.login);
authRouter.post("/signup", signupValidator, authController.signup);
authRouter.post("/refresh", authController.refreshToken);
