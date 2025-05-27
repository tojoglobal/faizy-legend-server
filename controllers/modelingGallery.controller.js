import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// Utility: Normalize slashes to always use /
function normalizePath(p) {
  return p ? p.replace(/\\/g, "/") : "";
}

// Utility: Unlink a file if exists (async)
function safeUnlink(filepath) {
  if (!filepath) return;
  fs.unlink(path.resolve(filepath), (err) => {
    if (err && err.code !== "ENOENT") {
      // Log only real errors, not "file does not exist"
      console.error("Unlink error:", filepath, err);
    }
  });
}

export const createGallery = async (req, res) => {
  try {
    const { name, location, photographer } = req.body;
    console.log("this is running part");

    const thumbnail = normalizePath(req.files?.thumbnail?.[0]?.path || "");
    const images =
      req.files?.images?.map((file) => normalizePath(file.path)) || [];
    console.log(thumbnail, images);

    await db.query(
      "INSERT INTO modeling_galleries (name, location, photographer, thumbnail, images) VALUES (?, ?, ?, ?, ?)",
      [name, location, photographer, thumbnail, JSON.stringify(images)]
    );
    res.status(201).json({ message: "Gallery created" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { name, location, photographer } = req.body;
    const id = req.params.id;
    // Get previous gallery
    const [rows] = await db.query(
      "SELECT * FROM modeling_galleries WHERE id=?",
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ error: "Gallery not found" });
    const prev = rows[0];
    let oldThumbnail = normalizePath(prev.thumbnail);
    let oldImages = prev.images ? JSON.parse(prev.images) : [];

    // Thumbnail logic: If a new one is uploaded, remove old
    let thumbnail = oldThumbnail;
    if (req.files?.thumbnail?.[0]) {
      thumbnail = normalizePath(req.files.thumbnail[0].path);
      if (oldThumbnail && oldThumbnail !== thumbnail) safeUnlink(oldThumbnail);
    }

    // Images logic: handle deletions and additions
    // 1. Get images to keep from client (if passed, for edit)
    let keepImages = req.body.keepImages
      ? JSON.parse(req.body.keepImages)
      : oldImages;

    // 2. Remove any images that are not in keepImages
    oldImages.forEach((img) => {
      if (!keepImages.includes(img)) safeUnlink(img);
    });

    // 3. Add new images if uploaded
    let images = keepImages;
    if (req.files?.images) {
      images = images.concat(
        req.files.images.map((file) => normalizePath(file.path))
      );
    }

    await db.query(
      "UPDATE modeling_galleries SET name=?, location=?, photographer=?, thumbnail=?, images=? WHERE id=?",
      [name, location, photographer, thumbnail, JSON.stringify(images), id]
    );
    res.json({ message: "Gallery updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    // Fetch gallery to get all file paths
    const [rows] = await db.query(
      "SELECT * FROM modeling_galleries WHERE id=?",
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ error: "Gallery not found" });
    const { thumbnail, images } = rows[0];
    // Unlink all images
    if (thumbnail) safeUnlink(normalizePath(thumbnail));
    const imgs = images ? JSON.parse(images) : [];
    imgs.forEach((img) => safeUnlink(normalizePath(img)));
    // Delete from db
    await db.query("DELETE FROM modeling_galleries WHERE id=?", [
      req.params.id,
    ]);
    res.json({ message: "Gallery deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getGalleries = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM modeling_galleries ORDER BY id DESC"
    );
    res.json(rows.map((r) => ({ ...r, images: JSON.parse(r.images || "[]") })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getGallery = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM modeling_galleries WHERE id=?",
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ error: "Gallery not found" });
    const r = rows[0];
    res.json({ ...r, images: JSON.parse(r.images || "[]") });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Delete a single image from gallery (also delete from disk)
export const deleteGalleryImage = async (req, res) => {
  try {
    const { imagePath } = req.body;
    const id = req.params.id;
    const [rows] = await db.query(
      "SELECT * FROM modeling_galleries WHERE id=?",
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ error: "Gallery not found" });
    let images = JSON.parse(rows[0].images || "[]");
    images = images.filter((img) => img !== imagePath);
    // Unlink file
    safeUnlink(normalizePath(imagePath));
    await db.query("UPDATE modeling_galleries SET images=? WHERE id=?", [
      JSON.stringify(images),
      id,
    ]);
    res.json({ message: "Image deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
