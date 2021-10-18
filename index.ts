import { createServer } from "http";

import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";

import { router } from "./src/routes";
import { printToConsole } from "./src/utils/helpers";
import { debug } from "console";
import bcrypt from "bcrypt";

config();

// import { createDiffieHellman, generatePrimeSync } from "crypto";

const PORT = process.env.PORT ?? 3001;
const MONGOURL = process.env.DB_URL ?? "";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("messageSent", (value) => {
    console.log(value);
    socket.broadcast.emit("message", value);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Hello");
});
app.use(router);

mongoose
  .connect(MONGOURL)
  .then((res) => {
    httpServer.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") printToConsole(PORT);
    });
  })
  .catch((err) => {
    console.log("Could not connect to mongodb");
  });

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    debug("HTTP server closed");
  });
});
