import fs from "fs";
import path from "path";
import db from "../Utils/db.js";

// Fix createIGComic
export const createIGComic = async (req, res) => {
  const thumbnail = req.files?.thumbnail?.[0]?.filename;
  const images = req.files?.images?.map((file) => file.filename);

  if (!thumbnail || !images || images.length === 0) {
    return res.status(400).json({ error: "Thumbnail and images are required." });
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
    const [results] = await db.query("SELECT * FROM ig_comics ORDER BY id DESC");
    res.json(results);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch comics." });
  }
};

export const deleteIGComic = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM ig_comics WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0)
      return res.status(404).json({ error: "Comic not found." });

    const comic = rows[0];
    const filesToDelete = [comic.thumbnail, ...JSON.parse(comic.images)];

    filesToDelete.forEach((f) => fs.unlink(path.join("uploads", f), () => {}));

    db.query("DELETE FROM ig_comics WHERE id = ?", [id], (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to delete comic." });
      res.json({ success: true });
    });
  });
};
