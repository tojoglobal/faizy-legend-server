import express from "express";
import * as controller from "../controllers/modelingGallery.controller.js";
import { upload } from "./../middleware/UploadFile.js";

const router = express.Router();

// CREATE gallery
router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 50 },
  ]),
  controller.createGallery
);

// UPDATE gallery (with new images, keep old if not sent)
router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 50 },
  ]),
  controller.updateGallery
);

// DELETE gallery
router.delete("/:id", controller.deleteGallery);

// GET all galleries
router.get("/", controller.getGalleries);

// GET single gallery
router.get("/:id", controller.getGallery);

// DELETE single image from gallery
router.delete("/:id/image", controller.deleteGalleryImage);

export default router;
