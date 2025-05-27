import express from "express";
import {
  getFilmingVideos,
  addFilmingVideo,
  updateFilmingVideo,
  deleteFilmingVideo,
} from "../controllers/filmingController.js";

const filmingRoute = express.Router();

filmingRoute.get("/filming", getFilmingVideos);
filmingRoute.post("/filming", addFilmingVideo);
filmingRoute.put("/filming/:id", updateFilmingVideo);
filmingRoute.delete("/filming/:id", deleteFilmingVideo);

export default filmingRoute;
