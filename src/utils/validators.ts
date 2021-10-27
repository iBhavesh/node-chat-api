import { body } from "express-validator";
import User from "../models/User";

export const signupValidator = [
  body("email")
    .notEmpty()
    .withMessage("E-mail is required")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid E-mail")
    .bail()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) return Promise.reject("Email already in use");
      } catch (e) {
        return Promise.reject("Somthing went wrong");
      }
    })
    .normalizeEmail(),
  body("password")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters"),
  body("name")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Name should be atleast 2 characters"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid E-mail")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 }),
];

export const updatePasswordValidator = [
  body("old-password")
    .isEmpty()
    .withMessage("Old password is required")
    .isLength({ min: 6 }),
  body("new-password")
    .isEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 }),
];
