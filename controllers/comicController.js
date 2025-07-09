import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// GET: Get all Faizy Comics
export const getFaizyComics = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM faizy_comics ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch Faizy Comics." });
  }
};

// POST: Upload Faizy Comic (images + text)
export const addFaizyComic = async (req, res) => {
  try {
    const { title, subtitle, description, follow_url } = req.body;
    const images = (req.files?.images || []).map(
      (f) => "/uploads/" + f.filename
    );

    if (!title || images.length === 0) {
      return res
        .status(400)
        .json({ error: "Title and at least one image required." });
    }

    await db.query(
      `INSERT INTO faizy_comics (title, subtitle, description, follow_url, images)
       VALUES (?, ?, ?, ?, ?)`,
      [title, subtitle, description, follow_url, JSON.stringify(images)]
    );

    res.json({ message: "Comic uploaded successfully." });
  } catch (e) {
    res.status(500).json({ error: "Failed to upload Faizy Comic." });
  }
};

export const updateFaizyComic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, follow_url } = req.body;

    // Extract new images if uploaded
    const newImages = (req.files?.images || []).map(
      (f) => "/uploads/" + f.filename
    );

    // Get existing images from DB to keep old ones if needed
    const [[existingComic]] = await db.query(
      "SELECT images FROM faizy_comics WHERE id = ?",
      [id]
    );
    if (!existingComic)
      return res.status(404).json({ error: "Comic not found" });

    let images = JSON.parse(existingComic.images || "[]");

    // If new images uploaded, append them (or replace, depending on your logic)
    if (newImages.length > 0) {
      images = images.concat(newImages);
    }

    // Validate title and images length
    if (!title || images.length === 0) {
      return res
        .status(400)
        .json({ error: "Title and at least one image required." });
    }

    // Update comic record
    await db.query(
      `UPDATE faizy_comics SET title=?, subtitle=?, description=?, follow_url=?, images=? WHERE id=?`,
      [title, subtitle, description, follow_url, JSON.stringify(images), id]
    );

    res.json({ message: "Comic updated successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update Faizy Comic." });
  }
};

// DELETE: Remove comic + images
export const deleteFaizyComic = async (req, res) => {
  try {
    const { id } = req.params;
    const [[comic]] = await db.query(
      "SELECT images FROM faizy_comics WHERE id = ?",
      [id]
    );

    if (comic?.images) {
      const paths = JSON.parse(comic.images || "[]");
      for (const filePath of paths) {
        if (filePath && filePath.startsWith("/uploads/")) {
          fs.unlink(
            path.join(process.cwd(), filePath.replace(/^\//, "")),
            () => {}
          );
        }
      }
    }

    await db.query("DELETE FROM faizy_comics WHERE id = ?", [id]);
    res.json({ message: "Comic deleted successfully." });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete Faizy Comic." });
  }
};

export const deleteComicImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body; // full image path to delete, e.g. "/uploads/abc.jpg"

    if (!image) {
      return res.status(400).json({ error: "Image path required" });
    }

    // Get comic from DB
    const [[comic]] = await db.query(
      "SELECT images FROM faizy_comics WHERE id = ?",
      [id]
    );
    if (!comic) return res.status(404).json({ error: "Comic not found" });

    let images = JSON.parse(comic.images || "[]");

    // Check if image exists in array
    if (!images.includes(image)) {
      return res.status(404).json({ error: "Image not found in comic" });
    }

    // Remove image from array
    images = images.filter((img) => img !== image);

    // Delete file from disk
    const filePath = path.join(process.cwd(), image.replace(/^\//, ""));
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete image file:", err);
    });

    // Update DB with new images array
    await db.query("UPDATE faizy_comics SET images = ? WHERE id = ?", [
      JSON.stringify(images),
      id,
    ]);

    res.json({ message: "Image deleted successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete image." });
  }
};
