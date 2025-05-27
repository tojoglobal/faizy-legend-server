import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

export const submitBookForm = async (req, res) => {
  try {
    const { name, lastName, email, message } = req.body;
    const file = req.file;
    if (!name || !lastName || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    let image_url = null;
    if (file) {
      image_url = `/uploads/${file.filename}`;
    }
    await db.query(
      "INSERT INTO book_forms (name, last_name, email, message, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, lastName, email, message, image_url]
    );
    res.json({ message: "Submission successful" });
  } catch (e) {
    res.status(500).json({ error: "Failed to submit form" });
  }
};

export const getBookForms = async (req, res) => {
  try {
    const [forms] = await db.query(
      "SELECT * FROM book_forms ORDER BY created_at DESC"
    );
    res.json(forms);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const deleteBookForm = async (req, res) => {
  try {
    const { id } = req.params;
    // get image path
    const [[row]] = await db.query(
      "SELECT image_url FROM book_forms WHERE id=?",
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
    await db.query("DELETE FROM book_forms WHERE id=?", [id]);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete submission" });
  }
};
