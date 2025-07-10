import fs from "fs";
import path from "path";
import db from "../Utils/db.js";

function normalizePath(p) {
  return p ? p.replace(/\\/g, "/") : "";
}

function safeUnlink(filepath) {
  if (!filepath) return;
  fs.unlink(path.resolve(filepath), (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Unlink error:", filepath, err);
    }
  });
}

export const deleteIGComic = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Delete request for comic id:", id);

    const [rows] = await db.query("SELECT * FROM ig_comics WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Comic not found." });
    }

    const comic = rows[0];
    // Assume thumbnails and images stored as just filenames, so prepend 'uploads/'
    const thumbPath = normalizePath(`uploads/${comic.thumbnail}`);
    const images = comic.images ? JSON.parse(comic.images) : [];
    const imagePaths = images.map((img) => normalizePath(`uploads/${img}`));

    safeUnlink(thumbPath);
    imagePaths.forEach(safeUnlink);

    await db.query("DELETE FROM ig_comics WHERE id = ?", [id]);

    console.log("Deleted comic id:", id);
    res.json({ success: true });
  } catch (e) {
    console.error("Delete error:", e);
    res.status(500).json({ error: e.message || "Failed to delete comic." });
  }
};

// Fix createIGComic
export const createIGComic = async (req, res) => {
  const thumbnail = req.files?.thumbnail?.[0]?.filename;
  const images = req.files?.images?.map((file) => file.filename);

  if (!thumbnail || !images || images.length === 0) {
    return res
      .status(400)
      .json({ error: "Thumbnail and images are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO ig_comics (thumbnail, images) VALUES (?, ?)",
      [thumbnail, JSON.stringify(images)]
    );
    res.json({ success: true, insertedId: result.insertId });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Failed to insert comic." });
  }
};

// Fix getAllIGComics
export const getAllIGComics = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM ig_comics ORDER BY id DESC"
    );
    res.json(results);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch comics." });
  }
};
