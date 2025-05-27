import db from "../Utils/db.js";

// Get all filming videos
const getFilmingVideos = async (req, res) => {
  try {
    const [videos] = await db.query(
      "SELECT * FROM filming_videos ORDER BY created_at DESC"
    );
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch filming videos" });
  }
};

// Add a new filming video
const addFilmingVideo = async (req, res) => {
  try {
    const { title, youtube_id, description } = req.body;
    if (!title || !youtube_id) {
      return res
        .status(400)
        .json({ error: "Title and YouTube ID are required" });
    }
    const [result] = await db.query(
      "INSERT INTO filming_videos (title, youtube_id, description) VALUES (?, ?, ?)",
      [title, youtube_id, description]
    );
    res.status(201).json({
      id: result.insertId,
      message: "Filming video added successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add filming video" });
  }
};

// Update a filming video
const updateFilmingVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, youtube_id, description } = req.body;
    const [existing] = await db.query(
      "SELECT * FROM filming_videos WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Filming video not found" });
    }
    await db.query(
      "UPDATE filming_videos SET title = ?, youtube_id = ?, description = ? WHERE id = ?",
      [title, youtube_id, description, id]
    );
    res.status(200).json({ message: "Filming video updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update filming video" });
  }
};

// Delete a filming video
const deleteFilmingVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query(
      "SELECT * FROM filming_videos WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Filming video not found" });
    }
    await db.query("DELETE FROM filming_videos WHERE id = ?", [id]);
    res.status(200).json({ message: "Filming video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete filming video" });
  }
};

export {
  getFilmingVideos,
  addFilmingVideo,
  updateFilmingVideo,
  deleteFilmingVideo,
};
