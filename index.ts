import { config } from "dotenv";
import express from "express";
import { createWriteStream } from "fs";
import { mkdir, stat } from "fs/promises";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";

import { init, getIO } from "./socket";
import { router } from "./src/routes";
import { printToConsole } from "./src/utils/helpers";

config();

const PORT = process.env.PORT ?? 3001;
const MONGOURL = process.env.DB_URL ?? "";

const app = express();


// Take in the request & filepath, stream the file to the filePath
const uploadFile = (req, filePath) => {
 return new Promise((resolve, reject) => {
  const stream = createWriteStream(filePath);
  // With the open - event, data will start being written
  // from the request to the stream's destination path
  stream.on('open', () => {
   console.log('Stream open ...  0.00%');
   req.pipe(stream);
  });

  // Drain is fired whenever a data chunk is written.
  // When that happens, print how much data has been written yet.
  stream.on('drain', () => {
   const written = parseInt(stream.bytesWritten);
   const total = parseInt(req.headers['content-length']);
   const pWritten = ((written / total) * 100).toFixed(2);
   console.log(`Processing  ...  ${pWritten}% done`);
  });

  // When the stream is finished, print a final message
  // Also, resolve the location of the file to calling function
  stream.on('close', () => {
   console.log('Processing  ...  100%');
   resolve(filePath);
  });
   // If something goes wrong, reject the primise
  stream.on('error', err => {
   console.error(err);
   reject(err);
  });
 });
};

// Add a basic get - route to check if server's up
app.get('/', (req, res) => {
 res.status(200).send(`Server up and running`);
});

// Add a route to accept incoming post requests for the fileupload.
// Also, attach two callback functions to handle the response.
app.post('/', (req, res) => {
 const filePath = path.join(__dirname, `/image.mp4`);
 uploadFile(req, filePath)
  .then(path => res.send({ status: 'success', path }))
  .catch(err => res.send({ status: 'error', err }));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  return res.send("Hello world");
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

const createFolders = async () => {
  try {
    const dir = await stat("uploads");
  } catch {
    await mkdir("uploads");
  }
};
