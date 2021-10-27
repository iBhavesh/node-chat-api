"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
        immutabe: true,
    },
    isMedia: {
        type: Boolean,
        required: true,
        immutable: true,
        default: false,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true,
    },
    deliveredAt: {
        type: Date,
        default: null,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
});
exports.default = (0, mongoose_1.model)("Chat", chatSchema);
