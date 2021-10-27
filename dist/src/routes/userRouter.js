"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const UserController = __importStar(require("../controllers/userController"));
const helpers_1 = require("../utils/helpers");
const validators_1 = require("../utils/validators");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.put("/name", UserController.updateName);
exports.userRouter
    .route("/profile-picture")
    // .get(UserController.getProfilePicture)
    .post((0, multer_1.default)({ storage: helpers_1.storage, fileFilter: helpers_1.imageFilter }).single("file"), UserController.updateProfilePicture);
exports.userRouter.put("/password", validators_1.updatePasswordValidator, UserController.updatePassword);
exports.userRouter.get("/:email", UserController.getUser);
