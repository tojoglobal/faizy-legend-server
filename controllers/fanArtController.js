import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// USER: Only returns approved=1 (no pagination)
export const getFanArt = async (req, res) => {
  try {
    const { search = "" } = req.query;
    let sqlBase = "FROM fan_art WHERE approved=1";
    const params = [];
    if (search) {
      sqlBase += " AND (user LIKE ?)";
      params.push(`%${search}%`);
    }
    const [rows] = await db.query(
      `SELECT * ${sqlBase} ORDER BY created_at DESC`,
      params
    );
    res.json({ rows });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch fan art" });
  }
};

// ADMIN: See ALL (WITH pagination)
export const getFanArtAdmin = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 9 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 9);

    let sqlBase = "FROM fan_art WHERE 1";
    const params = [];
    if (search) {
      sqlBase += " AND (user LIKE ?)";
      params.push(`%${search}%`);
    }

    // Count total
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) as count ${sqlBase}`,
      params
    );

    // Paginated data
    const sql = `SELECT * ${sqlBase} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const paginatedParams = [
      ...params,
      Number(pageSize),
      Number((pageNum - 1) * pageSize),
    ];
    const [rows] = await db.query(sql, paginatedParams);

    res.json({
      total: count,
      page: pageNum,
      pageSize,
      lastPage: Math.ceil(count / pageSize) || 1,
      rows,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch fan art (admin)" });
  }
};

// ADD fan art (multi-image/video upload, fields: user, agreed)
export const addFanArt = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ error: "User is required." });
    }
    // Enforce limits
    const images = (req.files?.images || []).map(
      (f) => "/uploads/" + f.filename
    );
    const videos = (req.files?.videos || []).map(
      (f) => "/uploads/" + f.filename
    );
    // Support vitiligoFace (single image)
    const vitiligoFace = req.files?.vitiligoFace
      ? ["/uploads/" + req.files.vitiligoFace[0].filename]
      : [];

    if (images.length > 10 || videos.length > 2) {
      // Remove uploaded files if above limit
      [...images, ...videos, ...vitiligoFace].forEach((f) =>
        fs.unlink(path.join(process.cwd(), f.replace(/^\//, "")), () => {})
      );
      return res
        .status(400)
        .json({ error: "Max 10 images and 2 videos allowed." });
    }
    // Insert agreed (can be 0 or 1, or null)
    await db.query(
      "INSERT INTO fan_art (user, images, videos, vitiligoFace) VALUES (?, ?, ?, ?)",
      [
        user,
        JSON.stringify(images),
        JSON.stringify(videos),
        JSON.stringify(vitiligoFace),
      ]
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

// DELETE fan art (remove all images/videos/faces)
export const deleteFanArt = async (req, res) => {
  try {
    const { id } = req.params;
    const [[row]] = await db.query(
      "SELECT images, videos, vitiligoFace FROM fan_art WHERE id=?",
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
    if (row?.vitiligoFace) {
      for (const f of JSON.parse(row.vitiligoFace || "[]")) {
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
