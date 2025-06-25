import express from "express";
import * as fanArt from "../controllers/fanArtController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { uploadFanArt } from "../middleware/uploadFanArt.js";

const fanArtRouter = express.Router();

fanArtRouter.get("/fan-art", fanArt.getFanArt);
fanArtRouter.post("/fan-art", uploadFanArt, fanArt.addFanArt);

fanArtRouter.get("/fan-art/admin", fanArt.getFanArtAdmin);
fanArtRouter.patch("/fan-art/:id/approve", verifyAdmin, fanArt.approveFanArt);
fanArtRouter.patch("/fan-art/:id/reject", verifyAdmin, fanArt.rejectFanArt);
fanArtRouter.delete("/fan-art/:id", verifyAdmin, fanArt.deleteFanArt);

export default fanArtRouter;
