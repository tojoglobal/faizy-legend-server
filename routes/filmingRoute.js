import express from "express";
import {
  getFilmingVideos,
  addFilmingVideo,
  updateFilmingVideo,
  deleteFilmingVideo,
} from "../controllers/filmingController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const filmingRoute = express.Router();

// Public routes
filmingRoute.get("/filming", getFilmingVideos);

// Admin-protected routes
filmingRoute.post("/filming", verifyAdmin, addFilmingVideo);
filmingRoute.put("/filming/:id", verifyAdmin, updateFilmingVideo);
filmingRoute.delete("/filming/:id", verifyAdmin, deleteFilmingVideo);

export default filmingRoute;
