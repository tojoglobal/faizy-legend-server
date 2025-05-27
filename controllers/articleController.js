import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// GET all articles
export const getArticles = async (req, res) => {
  try {
    const [articles] = await db.query(
      "SELECT * FROM articles ORDER BY created_at DESC"
    );
    res.json(articles);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

// ADD article (with image)
export const addArticle = async (req, res) => {
  try {
    const { title, link } = req.body;
    const file = req.file;
    if (!title || !link || !file) {
      return res
        .status(400)
        .json({ error: "All fields (title, link, image) are required." });
    }
    const image_url = `/uploads/${file.filename}`;
    await db.query(
      "INSERT INTO articles (title, image_url, link) VALUES (?, ?, ?)",
      [title, image_url, link]
    );
    res.json({ message: "Article added" });
  } catch (e) {
    res.status(500).json({ error: "Failed to add article" });
  }
};

// UPDATE article (optionally with new image)
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, image_url: oldImageUrl } = req.body;
    let image_url = oldImageUrl;
    if (req.file) image_url = `/uploads/${req.file.filename}`;
    if (!title || !link || !image_url) {
      return res
        .status(400)
        .json({ error: "All fields (title, link, image) are required." });
    }
    await db.query(
      "UPDATE articles SET title=?, image_url=?, link=? WHERE id=?",
      [title, image_url, link, id]
    );
    res.json({ message: "Article updated" });
  } catch (e) {
    res.status(500).json({ error: "Failed to update article" });
  }
};

// DELETE article + image file
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    // get image path
    const [[row]] = await db.query(
      "SELECT image_url FROM articles WHERE id=?",
      [id]
    );
    if (row && row.image_url && row.image_url.startsWith("/uploads/")) {
      const filePath = path.join(
        process.cwd(),
        row.image_url.replace(/^\//, "")
      );
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete file:", filePath, err);
        }
      });
    }
    await db.query("DELETE FROM articles WHERE id=?", [id]);
    res.json({ message: "Article deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete article" });
  }
};
