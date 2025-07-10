import fs from "fs";
import path from "path";
import db from "../Utils/db.js";

// Normalize file paths for different OS
function normalizePath(p) {
  return p ? p.replace(/\\/g, "/") : "";
}

// Safely delete a file
function safeUnlink(filepath) {
  if (!filepath) return;
  fs.unlink(path.resolve(filepath), (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Unlink error:", filepath, err);
    }
  });
}

// Delete Comic
export const deleteIGComic = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM ig_comics WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Comic not found." });
    }

    const comic = rows[0];
    const images = comic.images ? JSON.parse(comic.images) : [];
    const imagePaths = images.map((img) => normalizePath(`uploads/${img}`));
    imagePaths.forEach(safeUnlink);

    await db.query("DELETE FROM ig_comics WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (e) {
    console.error("Delete error:", e);
    res.status(500).json({ error: e.message || "Failed to delete comic." });
  }
};

// Create Comic
export const createIGComic = async (req, res) => {
  const mediaFiles = req.files?.mediaFiles?.map((file) => file.filename) || [];

  if (mediaFiles.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one image or video is required." });
  }

  try {
    await db.query("INSERT INTO ig_comics (images) VALUES (?)", [
      JSON.stringify(mediaFiles),
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Failed to insert comic." });
  }
};

// Get All Comics
export const getAllIGComics = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM ig_comics ORDER BY id DESC"
    );
    res.json(results);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch comics." });
  }
};
