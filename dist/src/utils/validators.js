"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordValidator = exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
exports.signupValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("E-mail is required")
        .bail()
        .isEmail()
        .withMessage("Please enter a valid E-mail")
        .bail()
        .custom(async (value) => {
        try {
            const user = await User_1.default.findOne({ email: value });
            if (user)
                return Promise.reject("Email already in use");
        }
        catch (e) {
            return Promise.reject("Somthing went wrong");
        }
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password should be atleast 6 characters"),
    (0, express_validator_1.body)("name")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Name should be atleast 2 characters"),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid E-mail")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 }),
];
exports.updatePasswordValidator = [
    (0, express_validator_1.body)("old-password")
        .isEmpty()
        .withMessage("Old password is required")
        .isLength({ min: 6 }),
    (0, express_validator_1.body)("new-password")
        .isEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 }),
];
