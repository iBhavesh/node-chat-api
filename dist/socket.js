"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.init = void 0;
const socket_io_1 = require("socket.io");
let io;
const init = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        },
    });
};
exports.init = init;
const getIO = () => {
    if (io) {
        return io;
    }
    else
        console.log("Socket not initialized");
};
exports.getIO = getIO;
