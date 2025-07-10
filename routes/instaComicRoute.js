import express from "express";
import {
  createIGComic,
  getAllIGComics,
  deleteIGComic,
  updateIGComic,
} from "../controllers/instaComicController.js";
import { uploadComic } from "../middleware/UploadComic.js";

const instaComicRouter = express.Router();

instaComicRouter.post(
  "/admin/ig-comics",
  uploadComic.fields([{ name: "mediaFiles", maxCount: 40 }]),
  createIGComic
);

instaComicRouter.get("/admin/ig-comics", getAllIGComics);
instaComicRouter.put(
  "/admin/ig-comics/:id",
  uploadComic.fields([{ name: "mediaFiles", maxCount: 40 }]),
  updateIGComic
);
instaComicRouter.delete("/admin/ig-comics/:id", deleteIGComic);

export default instaComicRouter;
