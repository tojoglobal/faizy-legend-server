import express from "express";
import { upload } from "../middleware/UploadFile.js";
import * as article from "../controllers/articleController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const articleRouter = express.Router();

articleRouter.get("/articles", article.getArticles);
articleRouter.post(
  "/articles",
  verifyAdmin,
  upload.single("image"),
  article.addArticle
);
articleRouter.put(
  "/articles/:id",
  verifyAdmin,
  upload.single("image"),
  article.updateArticle
);
articleRouter.delete("/articles/:id", verifyAdmin, article.deleteArticle);

export default articleRouter;
