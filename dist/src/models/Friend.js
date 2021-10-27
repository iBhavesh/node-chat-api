"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const friendSchema = new mongoose_1.Schema({
    user1: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        immutable: true,
    },
    user2: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        immutable: true,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true,
    },
});
exports.default = (0, mongoose_1.model)("Friend", friendSchema);
