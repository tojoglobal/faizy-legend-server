import axios from "axios";

export const getInstagramPosts = async (req, res) => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    // Fetch latest posts (limit: 12)
    const response = await axios.get(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,media_type,permalink,timestamp&limit=12&access_token=${accessToken}`
    );

    res.json({ success: true, posts: response.data.data });
  } catch (error) {
    console.error(
      "Instagram API Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch Instagram posts." });
  }
};
