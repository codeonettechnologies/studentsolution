const connectDB = require("../../../config/database");

const db = connectDB();
const util = require("util");

// Promisify db.query for async/await
const query = util.promisify(db.query).bind(db);

// -------------------- Coaching Posts --------------------

// Create post
exports.createPost = async (req, res) => {
  try {
    const { content, user_id } = req.body;
    const image_url = req.file ? `/uploads/coaching_posts/${req.file.filename}` : null;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const sql = `INSERT INTO coaching_post (content, user_id, image_url) VALUES (?, ?, ?)`;
    const result = await query(sql, [content, user_id, image_url]);

    res.status(201).json({ message: "Coaching post created", postId: result.insertId });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all posts
exports.getPost = async (req, res) => {
  try {
    const results = await query(`SELECT * FROM coaching_post ORDER BY created_at DESC`);
    res.status(200).json(results);
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get posts by user
exports.getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const results = await query(
      `SELECT * FROM coaching_post WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Get Posts by User Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await query(`DELETE FROM coaching_post WHERE id = ?`, [postId]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Coaching post deleted" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// -------------------- Likes --------------------

// // Add Like
// exports.addLike = async (req, res) => {
//   try {
//     const { user_id, coaching_post_id } = req.body;
//     if (!user_id || !coaching_post_id)
//       return res.status(400).json({ message: "user_id and coaching_post_id are required" });

//     const existing = await query(
//       `SELECT * FROM coaching_post_like WHERE user_id = ? AND coaching_post_id = ?`,
//       [user_id, coaching_post_id]
//     );
//     if (existing.length > 0)
//       return res.status(400).json({ message: "Post already liked by this user" });

//     const result = await query(
//       `INSERT INTO coaching_post_like (user_id, coaching_post_id) VALUES (?, ?)`,
//       [user_id, coaching_post_id]
//     );

//     res.status(201).json({ message: "Post liked successfully", likeId: result.insertId });
//   } catch (err) {
//     console.error("Add Like Error:", err);
//     res.status(500).json({ message: "Database error", error: err });
//   }
// };

// // Get Likes
// exports.getLike = async (req, res) => {
//   try {
//     const { coaching_post_id } = req.query;
//     let sql = "SELECT * FROM coaching_post_like";
//     const values = [];

//     if (coaching_post_id) {
//       sql += " WHERE coaching_post_id = ?";
//       values.push(coaching_post_id);
//     }

//     const results = await query(sql, values);
//     res.status(200).json(results);
//   } catch (err) {
//     console.error("Get Likes Error:", err);
//     res.status(500).json({ message: "Database error", error: err });
//   }
// };

// // Remove Like
// exports.removeLike = async (req, res) => {
//   try {
//     const { user_id, coaching_post_id } = req.body;
//     if (!user_id || !coaching_post_id)
//       return res.status(400).json({ message: "user_id and coaching_post_id are required" });

//     const result = await query(
//       `DELETE FROM coaching_post_like WHERE user_id = ? AND coaching_post_id = ?`,
//       [user_id, coaching_post_id]
//     );

//     if (result.affectedRows === 0) return res.status(404).json({ message: "Like not found" });

//     res.status(200).json({ message: "Like removed successfully" });
//   } catch (err) {
//     console.error("Remove Like Error:", err);
//     res.status(500).json({ message: "Database error", error: err });
//   }
// };



exports.toggle_like = async (req, res) => {
  try {
    const { user_id, coaching_post_id } = req.body;
 
    if (!user_id || !coaching_post_id) {
      return res.status(400).json({ message: "user_id and coaching_post_id are required" });
    }
 
    // Check if user already liked
    const existing = await query(
      "SELECT * FROM coaching_post_like WHERE coaching_post_id = ? AND user_id = ?",
      [coaching_post_id, user_id]
    );
 
    let message = "";
    let liked = false;
 
    if (existing.length > 0) {
      // Unlike
      await query(
        "DELETE FROM coaching_post_like WHERE coaching_post_id = ? AND user_id = ?",
        [coaching_post_id, user_id]
      );
      message = "Post unliked successfully";
      liked = false;
    } else {

      // Like
      await query(
        "INSERT INTO coaching_post_like (coaching_post_id, user_id) VALUES (?, ?)",
        [coaching_post_id, user_id]
      );
      message = "Post liked successfully";
      liked = true;
    }
 
    // Get updated like count
    const result = await query(
      "SELECT COUNT(*) AS total_likes FROM coaching_post_like WHERE coaching_post_id = ?",
      [coaching_post_id]
    );
 
    res.status(liked ? 201 : 200).json({
      message,
      liked,
      total_likes: result[0].total_likes
    });
 
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
 




// -------------------- Comments --------------------

// Create Comment
exports.addComment = async (req, res) => {
  try {
    const { content, coaching_post_id, user_id } = req.body;
    if (!content || !coaching_post_id)
      return res.status(400).json({ message: "Content and coaching_post_id are required" });

    const result = await query(
      `INSERT INTO coaching_post_comment (content, coaching_post_id, user_id) VALUES (?, ?, ?)`,
      [content, coaching_post_id, user_id || null]
    );

    res.status(201).json({ message: "Comment added successfully", commentId: result.insertId });
  } catch (err) {
    console.error("Create Comment Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all comments
exports.getComment = async (req, res) => {
  try {
    const { coaching_post_id } = req.query;
    let sql = "SELECT * FROM coaching_post_comment";
    const values = [];

    if (coaching_post_id) {
      sql += " WHERE coaching_post_id = ?";
      values.push(coaching_post_id);
    }

    const results = await query(sql, values);
    res.status(200).json(results);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM coaching_post_comment WHERE id = ?`, [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};
