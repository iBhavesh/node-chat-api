"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        immutable: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};
exports.default = (0, mongoose_1.model)("User", userSchema);
