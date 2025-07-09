import express from "express";
import {
  fetchInstagramPosts,
  getInstagramComics,
} from "../controllers/instaComicController";

const comicRoute = express.Router();

// Endpoint to trigger Instagram sync (can be protected or cron-called)
comicRoute.get("/instagram-sync", fetchInstagramPosts);

// Endpoint to get stored posts
comicRoute.get("/comics", getInstagramComics);

export default comicRoute;
