import db from "../Utils/db.js";

// Get all filming videos
const getFilmingVideos = async (req, res) => {
  try {
    const [videos] = await db.query(
      "SELECT * FROM filming_videos ORDER BY created_at DESC"
    );
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching filming videos:", error);
    res.status(500).json({ error: "Failed to fetch filming videos" });
  }
};

// Add a new filming video
const addFilmingVideo = async (req, res) => {
  try {
    const { title, image_url, youtube_id, description } = req.body;

    if (!title || !image_url || !youtube_id) {
      return res
        .status(400)
        .json({ error: "Title, image URL, and YouTube ID are required" });
    }

    const [result] = await db.query(
      "INSERT INTO filming_videos (title, image_url, youtube_id, description) VALUES (?, ?, ?, ?)",
      [title, image_url, youtube_id, description]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Filming video added successfully",
    });
  } catch (error) {
    console.error("Error adding filming video:", error);
    res.status(500).json({ error: "Failed to add filming video" });
  }
};

// Update a filming video
const updateFilmingVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, youtube_id, description } = req.body;

    const [existing] = await db.query(
      "SELECT * FROM filming_videos WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Filming video not found" });
    }

    await db.query(
      "UPDATE filming_videos SET title = ?, image_url = ?, youtube_id = ?, description = ? WHERE id = ?",
      [title, image_url, youtube_id, description, id]
    );

    res.status(200).json({ message: "Filming video updated successfully" });
  } catch (error) {
    console.error("Error updating filming video:", error);
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
    console.error("Error deleting filming video:", error);
    res.status(500).json({ error: "Failed to delete filming video" });
  }
};

export {
  getFilmingVideos,
  addFilmingVideo,
  updateFilmingVideo,
  deleteFilmingVideo,
};
