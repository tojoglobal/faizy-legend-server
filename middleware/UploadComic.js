import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config that supports images/videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

// Multer filter (optional, allows image/video only)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/", "video/"];
  if (allowed.some((type) => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed."), false);
  }
};

// Multer instance
export const uploadComic = multer({ storage, fileFilter });

// Optional: export a mini app if you want to mount it separately
export const comicUploadApp = express();
comicUploadApp.use("/uploads", express.static(path.resolve("uploads")));
