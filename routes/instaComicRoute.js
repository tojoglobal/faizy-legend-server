import express from "express";
import { getInstagramPosts } from "../controllers/InstaComicController.js";

const instaComicRoute = express.Router();
instaComicRoute.get("/instagram-posts", getInstagramPosts);

export default instaComicRoute;
