"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const promises_1 = require("fs/promises");
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const socket_1 = require("./socket");
const routes_1 = require("./src/routes");
const helpers_1 = require("./src/utils/helpers");
(0, dotenv_1.config)();
const PORT = process.env.PORT ?? 3001;
const MONGOURL = process.env.DB_URL ?? "";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.get("/", (req, res) => {
    return res.send("Hello");
});
app.use(routes_1.router);
mongoose_1.default
    .connect(MONGOURL)
    .then((res) => {
    const server = app.listen(PORT, () => {
        if (process.env.NODE_ENV !== "production")
            (0, helpers_1.printToConsole)(PORT);
    });
    (0, socket_1.init)(server);
    socketCon();
    createFolders();
    process.on("SIGTERM", () => {
        console.debug("SIGTERM signal received: closing HTTP server");
        server.close(() => {
            console.debug("HTTP server closed");
        });
    });
})
    .catch((err) => {
    console.log("Could not connect to mongodb");
});
const socketCon = () => {
    (0, socket_1.getIO)()?.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("messageSent", (value) => {
            console.log(value);
            socket.broadcast.emit("message", value);
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
};
const createFolders = async () => {
    try {
        const dir = await (0, promises_1.stat)("uploads");
    }
    catch {
        await (0, promises_1.mkdir)("uploads");
    }
};
