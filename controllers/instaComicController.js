import axios from "axios";
import db from "../Utils/db.js";

const INSTAGRAM_USER_ID = "your-instagram-user-id";
const ACCESS_TOKEN = "your-access-token";

// Helper to get media details from Instagram API
export const fetchInstagramPosts = async (req, res) => {
  try {
    // Fetch recent media from Instagram Graph API
    const fields =
      "id,caption,media_url,media_type,timestamp,children{media_url,media_type}";
    const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=${fields}&access_token=${ACCESS_TOKEN}`;

    const response = await axios.get(url);
    const posts = response.data.data || [];

    for (const post of posts) {
      // Check if post exists in DB
      const [[existing]] = await db.query(
        "SELECT id FROM instagram_comics WHERE instagram_post_id = ?",
        [post.id]
      );

      if (existing) continue; // skip already saved post

      // For carousel posts (multiple images)
      let additional_media = [];
      if (post.media_type === "CAROUSEL_ALBUM" && post.children) {
        additional_media = post.children.data.map((child) => ({
          media_url: child.media_url,
          media_type: child.media_type,
        }));
      }

      await db.query(
        "INSERT INTO instagram_comics (instagram_post_id, media_url, caption, timestamp, media_type, additional_media) VALUES (?, ?, ?, ?, ?, ?)",
        [
          post.id,
          post.media_url,
          post.caption || "",
          new Date(post.timestamp),
          post.media_type,
          JSON.stringify(additional_media),
        ]
      );
    }

    res.json({ message: "Instagram posts synced successfully." });
  } catch (error) {
    console.error(
      "Instagram fetch error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch Instagram posts." });
  }
};

// API to get stored posts from DB
export const getInstagramComics = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM instagram_comics ORDER BY timestamp DESC"
    );
    res.json({ rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stored posts" });
  }
};
