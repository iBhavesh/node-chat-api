import { Server as SocketServer } from "socket.io";

import { Server } from "http";

let io: SocketServer | null;

export const init = (server: Server) => {
  io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });
};

export const getIO = () => {
  if (io) {
    return io;
  } else console.log("Socket not initialized");
};
