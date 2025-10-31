const connectDB = require("../../../config/database");

const db = connectDB();
const util = require("util");

const query = util.promisify(db.query).bind(db);

// -------------------- Coaching Posts --------------------

exports.createPost = async (req, res) => {
  try {
    const { content, user_id } = req.body;

    const image_url = req.file ? req.file.filename : null;

    if (!content)
      return res.status(400).json({ message: "Content is required" });

    const sql = `INSERT INTO coaching_post (content, user_id, image_url) VALUES (?, ?, ?)`;
    const result = await query(sql, [content, user_id, image_url]);

    res
      .status(201)
      .json({ message: "Coaching post created", postId: result.insertId });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all posts
exports.getPost = (req, res) => {
  try {
    const sql = `
      SELECT 
        cp.*, 
        u.name AS user_name, 
        u.profile_image AS profile_image,
        u.college AS user_college, 
        u.college_year AS user_year
      FROM coaching_post cp
      JOIN users u ON cp.user_id = u.id
      ORDER BY cp.id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      res.status(200).json({
        message: "All coaching posts fetched",
        data: results,
      });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get posts by user
 
exports.getCoachingPostsByUserId = async (req, res) => {
  const { userId } = req.params;

  // Manual validation
  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID. It must be a positive number.',
    });
  }

  try {
    const [rows] = await database.execute(
      `SELECT 
         cp.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM coaching_post cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};



// Delete post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await query(`DELETE FROM coaching_post WHERE id = ?`, [
      postId,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Coaching post deleted" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};




exports.addComment = async (req, res) => {
  try {
    const { user_id, coaching_post_id, comment_text } = req.body;

    if (!user_id || !coaching_post_id || !comment_text) {
      return res.status(400).json({
        message: "user_id, coaching_post_id, and comment_text are required",
      });
    }

    const sql = `
      INSERT INTO coaching_post_comment (user_id, coaching_post_id, comment_text)
      VALUES (?, ?, ?)
    `;

    const result = await query(sql, [user_id, coaching_post_id, comment_text]);

    res.status(201).json({
      message: "Comment added successfully",
      commentId: result.insertId,
    });
  } catch (err) {
    console.error("Create Comment Error:", err);
    res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }
};

exports.getComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const sql = `
      SELECT c.id, c.comment_text, c.created_at, u.id AS user_id, u.name AS user_name
      FROM coaching_post_comment c
      JOIN users u ON c.user_id = u.id
      WHERE c.coaching_post_id = ?
      ORDER BY c.created_at ASC
    `;

    const results = await query(sql, [id]);

    const formattedResults = results.map((c) => ({
      id: c.id,
      comment_text: c.comment_text,
      created_at: c.created_at,
      user_id: c.user_id,
      user_name: c.user_name,
    }));

    res.status(200).json({
      message: "Comments fetched successfully",
      data: formattedResults,
    });
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Delete comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `DELETE FROM coaching_post_comment WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// like-------------------------------------------------------------------------------------------------------------------------------
// ✅ Toggle Like / Unlike
const database = connectDB().promise();

exports.toggle_like = async (req, res) => {
  try {
    const { user_id, coaching_post_id } = req.body;

    if (!user_id || !coaching_post_id) {
      return res
        .status(400)
        .json({ message: "user_id and coaching_post_id are required" });
    }

    const [existing] = await database.query(
      "SELECT `like` FROM coaching_post_likes WHERE coaching_post_id = ? AND user_id = ?",
      [coaching_post_id, user_id]
    );

    let message = "";
    let liked = false;

    if (existing.length > 0) {
      const newLikeValue = existing[0].like ? 0 : 1;

      await database.query(
        "UPDATE coaching_post_likes SET `like` = ?, updated_at = NOW() WHERE coaching_post_id = ? AND user_id = ?",
        [newLikeValue, coaching_post_id, user_id]
      );

      message = newLikeValue
        ? "Post liked successfully"
        : "Post unliked successfully";
      liked = !!newLikeValue;
    } else {
      await database.query(
        "INSERT INTO coaching_post_likes (coaching_post_id, user_id, `like`) VALUES (?, ?, 1)",
        [coaching_post_id, user_id]
      );

      message = "Post liked successfully";
      liked = true;
    }

    const [result] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM coaching_post_likes WHERE coaching_post_id = ? AND `like` = 1",
      [coaching_post_id]
    );

    res.status(200).json({
      message,
      liked,
      total_likes: result[0].total_likes,
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

 
// ✅ Get Like Status

exports.get_like_status = async (req, res) => {
  try {
    const { coaching_post_id } = req.query;

    if (!coaching_post_id) {
      return res.status(400).json({ message: "coaching_post_id is required" });
    }

    // Fetch all users who liked this post
    const [likes] = await database.query(
      `SELECT u.id AS user_id, u.name AS user_name
       FROM coaching_post_likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.coaching_post_id = ? AND l.like = 1`,
      [coaching_post_id]
    );

    // Total likes count
    const totalLikes = likes.length;

    res.status(200).json({
      message: "All likes fetched successfully",
      coaching_post_id,
      total_likes: totalLikes,
      liked_users: likes
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// Search CoachingPost
exports.searchCoachings = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const sql = `
      SELECT cp.*, u.name, u.college
      FROM coaching_post cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.name LIKE ? OR u.college LIKE ?
    `;

    const searchValue = `%${query}%`;

    db.query(sql, [searchValue, searchValue], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
