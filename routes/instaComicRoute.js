import express from "express";
import {
  createIGComic,
  getAllIGComics,
  deleteIGComic,
} from "../controllers/instaComicController.js";
import { upload } from "../middleware/UploadFile.js";
const instaComicRouter = express.Router();

instaComicRouter.post(
  "/admin/ig-comics",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 40 },
  ]),
  createIGComic
);
instaComicRouter.get("/admin/ig-comics", getAllIGComics);
instaComicRouter.delete("/admin/ig-comics/:id", deleteIGComic);

export default instaComicRouter;
