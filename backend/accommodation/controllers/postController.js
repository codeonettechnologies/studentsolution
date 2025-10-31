
const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

exports.accommodation_post = (req, res) => {
  try {
    const { user_id, content } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const sql =
      "INSERT INTO accommodation_post (user_id, image_url , content) VALUES (?, ? , ?)";

    db.query(sql, [user_id, image_url, content], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(201).json({
        message: "accommodation post created",
        id: result.insertId,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// get all post
exports.get_all_accommodation_posts = (req, res) => {
  try {
    const sql = `
      SELECT
        ap.*,
        u.name AS user_name,
        u.profile_image AS profile_image,
        u.college AS user_college,
        u.college_year AS user_year
      FROM accommodation_post ap
      JOIN users u ON ap.user_id = u.id
      ORDER BY ap.id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(200).json({
        message: "All accommodation posts fetched",
        data: results,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getaccommodationPostsByUserId = async (req, res) => {
  const { userId } = req.params;

  // Manual validation
  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID. It must be a positive number.",
    });
  }

  try {
    const [rows] = await database.execute(
      `SELECT 
         ap.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM accommodation_post ap
       JOIN users u ON ap.user_id = u.id
       WHERE ap.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching accommodation posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.delete_accommodation_post = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "accommodation post id is required" });
    }

    const sql = "DELETE FROM accommodation_post WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "accommodation post not found" });
      }

      res.status(200).json({ message: "accommodation post deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



//---------------------------------------comment-------------------------------------------------------------------------




exports.add_comment = (req, res) => {
  try {
    const { user_id, accommodation_post_id, comment_text } = req.body;

    if (!user_id || !accommodation_post_id || !comment_text) {
      return res.status(400).json({
        message: "user_id, accommodation_post_id and comment_text are required",
      });
    }

    const sql =
      "INSERT INTO accommodation_post_comments (accommodation_post_id, user_id, comment_text) VALUES (?, ?, ?)";

    db.query(sql, [accommodation_post_id, user_id, comment_text], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res
        .status(201)
        .json({ message: "Comment added successfully", id: result.insertId });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.get_comments = (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT c.id, c.comment_text, c.created_at, u.id AS user_id, u.name AS user_name
      FROM accommodation_post_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.accommodation_post_id = ?
      ORDER BY c.created_at ASC
    `;

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(200).json({
        message: "Comments fetched successfully",
        data: results,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.delete_comment = (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM accommodation_post_comments WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.status(200).json({ message: "Comment deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



//------------like----------------------------

exports.toggle_like = async (req, res) => {
  try {
    const { user_id, accommodation_post_id } = req.body;
    if (!user_id || !accommodation_post_id) {
      return res
        .status(400)
        .json({ message: "user_id and accommodation_post_id are required" });
    }

    const [existing] = await database.query(
      "SELECT `like` FROM accommodation_post_likes WHERE accommodation_post_id = ? AND user_id = ?",
      [accommodation_post_id, user_id]
    );

    let message = "";
    let liked = false;

    if (existing.length > 0) {
      const newLikeValue = existing[0].like ? 0 : 1;

      await database.query(
        "UPDATE accommodation_post_likes SET `like` = ?, updated_at = NOW() WHERE accommodation_post_id = ? AND user_id = ?",
        [newLikeValue, accommodation_post_id, user_id]
      );

      message = newLikeValue
        ? "Post liked successfully"
        : "Post unliked successfully";
      liked = !!newLikeValue;
    } else {
      await database.query(
        "INSERT INTO accommodation_post_likes (accommodation_post_id, user_id, `like`) VALUES (?, ?, 1)",
        [accommodation_post_id, user_id]
      );

      message = "Post liked successfully";
      liked = true;
    }

    const [result] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM accommodation_post_likes WHERE accommodation_post_id = ? AND `like` = 1",
      [accommodation_post_id]
    );

    res.status(200).json({
      message,
      liked,
      total_likes: result[0].total_likes,
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



exports.get_like_status = async (req, res) => {
  try {
    const { accommodation_post_id, user_id } = req.query;

    if (!accommodation_post_id) {
      return res.status(400).json({ message: "accommodation_post_id is required" });
    }

    // Total likes count
    const [likeCount] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM accommodation_post_likes WHERE accommodation_post_id = ? AND `like` = 1",
      [accommodation_post_id]
    );

    let liked = false;
    let userName = null;

    // If user_id is provided, check like status and fetch user name
    if (user_id) {
      const [userLike] = await database.query(
        "SELECT * FROM accommodation_post_likes WHERE accommodation_post_id = ? AND user_id = ? AND `like` = 1",
        [accommodation_post_id, user_id]
      );

      liked = userLike.length > 0;

      // Fetch user name
      const [userData] = await database.query(
        "SELECT name FROM users WHERE id = ?",
        [user_id]
      );

      if (userData.length > 0) {
        userName = userData[0].name;
      }
    }

    res.status(200).json({
      accommodation_post_id,
      liked,
      total_likes: likeCount[0].total_likes,
      user_name: userName || "Guest",
    });
  } catch (error) {
    console.error("Get like status error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.searchAccommodation = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const searchValue = `%${query}%`;

    // 1️⃣ Fetch posts matching search text or user name
    const sql = `
      SELECT 
        ap.*, 
        u.name AS post_user_name
      FROM accommodation_post ap
      JOIN users u ON ap.user_id = u.id
      WHERE u.name LIKE ? OR ap.content LIKE ?
      ORDER BY ap.created_at DESC
    `;

    db.query(sql, [searchValue, searchValue], (err, posts) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (posts.length === 0) {
        return res.json([]);
      }

      const postIds = posts.map((p) => p.id);

      // 2️⃣ Get all likes (who liked which post)
      const likesSql = `
        SELECT l.accommodation_post_id, u.id AS user_id, u.name AS user_name
        FROM accommodation_post_likes l
        JOIN users u ON l.user_id = u.id
        WHERE l.accommodation_post_id IN (?) AND l.like = 1
      `;

      // 3️⃣ Get all comments (who commented + what)
      const commentsSql = `
        SELECT c.accommodation_post_id, c.comment_text, u.id AS user_id, u.name AS user_name
        FROM accommodation_post_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.accommodation_post_id IN (?)
      `;

      db.query(likesSql, [postIds], (likeErr, likes) => {
        if (likeErr) {
          console.error("Likes Error:", likeErr);
          return res.status(500).json({ message: "Error fetching likes" });
        }

        db.query(commentsSql, [postIds], (commentErr, comments) => {
          if (commentErr) {
            console.error("Comments Error:", commentErr);
            return res.status(500).json({ message: "Error fetching comments" });
          }

          // 4️⃣ Combine all data together
          const result = posts.map((post) => {
            const postLikes = likes.filter(
              (l) => l.accommodation_post_id === post.id
            );
            const postComments = comments.filter(
              (c) => c.accommodation_post_id === post.id
            );

            return {
              ...post,
              likes_count: postLikes.length,
              comments_count: postComments.length,
              likes: postLikes.map((l) => ({
                user_id: l.user_id,
                name: l.user_name,
              })),
              comments: postComments.map((c) => ({
                user_id: c.user_id,
                name: c.user_name,
                comment: c.comment_text,
              })),
            };
          });

          res.json(result);
        });
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
