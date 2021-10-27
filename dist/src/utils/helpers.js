"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoFilter = exports.imageFilter = exports.storage = exports.printToConsole = void 0;
const address_1 = __importDefault(require("address"));
const multer_1 = __importDefault(require("multer"));
const printToConsole = (port) => {
    console.log("Server is running");
    console.log(`Local:            http://localhost:${port}`);
    console.log(`On Your Network:  http://${address_1.default.ip()}:${port}`);
};
exports.printToConsole = printToConsole;
exports.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const fileName = Date.now().toString() + Math.round(Math.random() * 100) + "." + ext;
        cb(null, fileName);
    },
});
const imageFilter = (req, file, cb) => {
    const mime = file.mimetype.split("/")[0];
    if (mime === "image") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.imageFilter = imageFilter;
const videoFilter = (req, file, cb) => {
    const mime = file.mimetype.split("/")[0];
    if (mime === "image") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.videoFilter = videoFilter;
