import db from "../Utils/db.js";

// PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM shopping_products p 
       LEFT JOIN shopping_categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, link, category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    if (!name || !image_url) {
      return res.status(400).json({ error: "Name and image are required" });
    }
    await db.query(
      "INSERT INTO shopping_products (name, image_url, category_id, link) VALUES (?, ?, ?, ?)",
      [name, image_url, category_id || null, link]
    );
    res.json({ message: "Product added" });
  } catch (e) {
    res.status(500).json({ error: "Failed to add product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, category_id } = req.body;
    let image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url;
    if (!name || !image_url) {
      return res.status(400).json({ error: "Name and image are required" });
    }
    await db.query(
      "UPDATE shopping_products SET name=?, image_url=?, category_id=?, link=? WHERE id=?",
      [name, image_url, category_id || null, link, id]
    );
    res.json({ message: "Product updated" });
  } catch (e) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM shopping_products WHERE id=?", [id]);
    res.json({ message: "Product deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM shopping_categories ORDER BY name"
    );
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name required" });
    await db.query("INSERT INTO shopping_categories (name) VALUES (?)", [name]);
    res.json({ message: "Category added" });
  } catch (e) {
    res.status(500).json({ error: "Failed to add category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name required" });
    await db.query("UPDATE shopping_categories SET name=? WHERE id=?", [
      name,
      id,
    ]);
    res.json({ message: "Category updated" });
  } catch (e) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM shopping_categories WHERE id=?", [id]);
    res.json({ message: "Category deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
