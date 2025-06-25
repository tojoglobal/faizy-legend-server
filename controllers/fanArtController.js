import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// GET all fan art (with search and tab filters)
export const getFanArt = async (req, res) => {
  try {
    const { search = "", type } = req.query;
    let sql = "SELECT * FROM fan_art WHERE 1";
    const params = [];
    if (search) {
      sql += " AND (user LIKE ? OR title LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (type === "photos") {
      sql += " AND JSON_LENGTH(images) > 0";
    }
    if (type === "videos") {
      sql += " AND JSON_LENGTH(videos) > 0";
    }
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch fan art" });
  }
};

// ADD fan art (multi-image/video upload, fields: user, title, tags)
export const addFanArt = async (req, res) => {
  try {
    const { user, title, tags } = req.body;
    if (!user || !title) {
      return res.status(400).json({ error: "User and title are required." });
    }
    // Enforce limits
    const images = (req.files?.images || []).map(
      (f) => "/uploads/" + f.filename
    );
    const videos = (req.files?.videos || []).map(
      (f) => "/uploads/" + f.filename
    );
    if (images.length > 10 || videos.length > 2) {
      // Remove uploaded files if above limit
      [...images, ...videos].forEach((f) =>
        fs.unlink(path.join(process.cwd(), f.replace(/^\//, "")), () => {})
      );
      return res
        .status(400)
        .json({ error: "Max 10 images and 2 videos allowed." });
    }
    await db.query(
      "INSERT INTO fan_art (user, title, tags, images, videos) VALUES (?, ?, ?, ?, ?)",
      [user, title, tags || "", JSON.stringify(images), JSON.stringify(videos)]
    );
    res.json({ message: "Fan art submitted! Awaiting admin approval." });
  } catch (e) {
    res.status(500).json({ error: "Failed to submit fan art" });
  }
};

// ADMIN: Approve
export const approveFanArt = async (req, res) => {
  try {
    await db.query("UPDATE fan_art SET approved=1 WHERE id=?", [req.params.id]);
    res.json({ message: "Fan art approved" });
  } catch {
    res.status(500).json({ error: "Failed to approve" });
  }
};

// ADMIN: Reject
export const rejectFanArt = async (req, res) => {
  try {
    await db.query("UPDATE fan_art SET approved=0 WHERE id=?", [req.params.id]);
    res.json({ message: "Fan art rejected" });
  } catch {
    res.status(500).json({ error: "Failed to reject" });
  }
};

// DELETE fan art (remove all images/videos)
export const deleteFanArt = async (req, res) => {
  try {
    const { id } = req.params;
    const [[row]] = await db.query(
      "SELECT images, videos FROM fan_art WHERE id=?",
      [id]
    );
    // Remove files
    if (row?.images) {
      for (const f of JSON.parse(row.images || "[]")) {
        if (f && f.startsWith("/uploads/")) {
          fs.unlink(path.join(process.cwd(), f.replace(/^\//, "")), () => {});
        }
      }
    }
    if (row?.videos) {
      for (const f of JSON.parse(row.videos || "[]")) {
        if (f && f.startsWith("/uploads/")) {
          fs.unlink(path.join(process.cwd(), f.replace(/^\//, "")), () => {});
        }
      }
    }
    await db.query("DELETE FROM fan_art WHERE id=?", [id]);
    res.json({ message: "Fan art deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete fan art" });
  }
};
