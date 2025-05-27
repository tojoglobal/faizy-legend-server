import express from "express";
import { upload } from "../middleware/UploadFile.js";
import * as shopping from "../controllers/shoppingController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const shoppingRoute = express.Router();

// Products
shoppingRoute.get("/shopping/products", shopping.getProducts);
shoppingRoute.post(
  "/shopping/products",
  verifyAdmin,
  upload.single("image"),
  shopping.addProduct
);
shoppingRoute.put(
  "/shopping/products/:id",
  verifyAdmin,
  upload.single("image"),
  shopping.updateProduct
);
shoppingRoute.delete("/shopping/products/:id", verifyAdmin, shopping.deleteProduct);

// Categories
shoppingRoute.get("/shopping/categories", shopping.getCategories);
shoppingRoute.post("/shopping/categories", verifyAdmin, shopping.addCategory);
shoppingRoute.put("/shopping/categories/:id", verifyAdmin, shopping.updateCategory);
shoppingRoute.delete("/shopping/categories/:id", verifyAdmin, shopping.deleteCategory);

export default shoppingRoute;
