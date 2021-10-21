import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";

import { init, getIO } from "./socket";
import { router } from "./src/routes";
import { printToConsole } from "./src/utils/helpers";

config();

const PORT = process.env.PORT ?? 3001;
const MONGOURL = process.env.DB_URL ?? "";

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  return res.send("Hello");
});
app.use(router);

mongoose
  .connect(MONGOURL)
  .then((res) => {
    const server = app.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") printToConsole(PORT);
    });

    init(server);
    socketCon();

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
  getIO()?.on("connection", (socket) => {
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
