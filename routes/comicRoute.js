import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  addFaizyComic,
  deleteComicImage,
  deleteFaizyComic,
  getFaizyComics,
  updateFaizyComic,
} from "../controllers/comicController.js";

const comicRoute = express.Router();

// ✅ Get latest comic
comicRoute.get("/faizy-comic", getFaizyComics);

// ✅ Upload new comic (no approval)
comicRoute.post(
  "/faizy-comic",
  upload.fields([{ name: "images", maxCount: 20 }]),
  addFaizyComic
);

comicRoute.put(
  "/faizy-comic/:id",
  upload.fields([{ name: "images", maxCount: 20 }]), // to support file uploads on update
  updateFaizyComic
);
  
// ✅ Delete comic
comicRoute.delete("/faizy-comic/:id", deleteFaizyComic);
comicRoute.delete("/faizy-comic/:id/image", deleteComicImage);

export default comicRoute;
