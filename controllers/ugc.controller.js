import db from "../Utils/db.js";

// Helper to extract YouTube ID from URL or ID
const getYoutubeId = (input) => {
  if (!input) return "";
  // Handles embed, shorts, watch?v, youtu.be/ etc.
  const match = input.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/
  );
  if (match) return match[1];
  if (input.length === 11) return input;
  return input;
};

// Helper to get YouTube thumbnail from ID
const getThumbnail = (youtube_id) =>
  `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;

// CREATE UGC video
export const createUGC = async (req, res) => {
  try {
    const { url, title } = req.body;
    const youtube_id = getYoutubeId(url);
    const thumbnail = getThumbnail(youtube_id);
    await db.query(
      "INSERT INTO ugc_videos (url, youtube_id, thumbnail, title) VALUES (?, ?, ?, ?)",
      [url, youtube_id, thumbnail, title]
    );
    res.status(201).json({ message: "UGC video added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// UPDATE UGC video
export const updateUGC = async (req, res) => {
  try {
    const { url, title } = req.body;
    const id = req.params.id;
    const youtube_id = getYoutubeId(url);
    const thumbnail = getThumbnail(youtube_id);
    await db.query(
      "UPDATE ugc_videos SET url=?, youtube_id=?, thumbnail=?, title=? WHERE id=?",
      [url, youtube_id, thumbnail, title, id]
    );
    res.json({ message: "UGC video updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE UGC video
export const deleteUGC = async (req, res) => {
  try {
    await db.query("DELETE FROM ugc_videos WHERE id=?", [req.params.id]);
    res.json({ message: "UGC video deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET all UGC videos
export const getUGCs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ugc_videos ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET single UGC video
export const getUGC = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ugc_videos WHERE id=?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
