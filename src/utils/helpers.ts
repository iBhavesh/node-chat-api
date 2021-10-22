import address from "address";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

type FileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void;

export const printToConsole = (port: number | string) => {
  console.log("Server is running");
  console.log(`Local:            http://localhost:${port}`);
  console.log(`On Your Network:  http://${address.ip()}:${port}`);
};

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName =
      Date.now().toString() + Math.round(Math.random() * 100) + "." + ext;
    cb(null, fileName);
  },
});

export const imageFilter: FileFilter = (req, file, cb) => {
  const mime = file.mimetype.split("/")[0];
  if (mime === "image") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const videoFilter: FileFilter = (req, file, cb) => {
  const mime = file.mimetype.split("/")[0];
  if (mime === "image") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
