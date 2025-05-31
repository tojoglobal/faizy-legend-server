import express from "express";
import * as controller from "../controllers/ugc.controller.js";

const router = express.Router();

// CREATE UGC
router.post("/", controller.createUGC);

// UPDATE UGC
router.put("/:id", controller.updateUGC);

// DELETE UGC
router.delete("/:id", controller.deleteUGC);

// GET all UGCs
router.get("/", controller.getUGCs);

// GET single UGC
router.get("/:id", controller.getUGC);

export default router;
