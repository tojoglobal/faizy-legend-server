import express from "express";
import { upload } from "../middleware/UploadFile.js";
import * as book from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.post("/book-form", upload.single("files"), book.submitBookForm);
bookRouter.get("/book-form", book.getBookForms);
bookRouter.delete("/book-form/:id", book.deleteBookForm);

export default bookRouter;
