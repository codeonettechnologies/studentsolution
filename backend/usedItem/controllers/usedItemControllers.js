const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

// -------------------- CREATE USED ITEM POST --------------------
exports.createUsedItemPost = (req, res) => {
  try {
    const { user_id, title, description, price } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const sql = `
      INSERT INTO usedItem_post (user_id, title, description, price, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [user_id, title, description, price || null, image_url], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(201).json({
        message: "Used item post created successfully",
        postId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Internal error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// -------------------- GET ALL USED ITEM POSTS --------------------
exports.getAllUsedItems = (req, res) => {
  try {
    const sql = `
      SELECT 
        ui.*, 
        u.name AS user_name, 
        u.profile_image AS profile_image,
        u.college AS user_college,
        u.college_year AS user_year
      FROM usedItem_post ui
      JOIN users u ON ui.user_id = u.id
      ORDER BY ui.id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      res.status(200).json({
        message: "All used item posts fetched successfully",
        data: results,
      });
    });
  } catch (error) {
    console.error("Internal error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// -------------------- GET USER’S OWN USED ITEM POSTS --------------------
exports.getUsedItems_byUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID. It must be a positive number.",
    });
  }

  try {
    const [rows] = await database.execute(
      `SELECT 
         ui.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM usedItem_post ui
       JOIN users u ON ui.user_id = u.id
       WHERE ui.user_id = ?
       ORDER BY ui.id DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching user used item posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// -------------------- DELETE USED ITEM POST --------------------
exports.deleteUsedItemPost = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Used item post id is required" });
    }

    const sql = "DELETE FROM usedItem_post WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Used item post not found" });
      }

      res.status(200).json({ message: "Used item post deleted successfully" });
    });
  } catch (error) {
    console.error("Internal error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// -------------------- SEARCH USED ITEM POSTS --------------------
exports.searchUsedItems = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const sql = `
      SELECT ui.*, u.name, u.college
      FROM usedItem_post ui
      JOIN users u ON ui.user_id = u.id
      WHERE ui.title LIKE ? OR ui.description LIKE ? OR u.name LIKE ?
    `;

    const searchValue = `%${query}%`;

    db.query(sql, [searchValue, searchValue, searchValue], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({
        message: "Search results fetched successfully",
        data: results,
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// -------------------- ADD COMMENT --------------------
exports.addComment = async (req, res) => {
  try {
    const { user_id, usedItem_post_id, comment_text } = req.body;

    if (!user_id || !usedItem_post_id || !comment_text) {
      return res.status(400).json({
        message: "user_id, usedItem_post_id, and comment_text are required",
      });
    }

    const sql = `
      INSERT INTO usedItem_post_comment (user_id, usedItem_post_id, comment_text)
      VALUES (?, ?, ?)
    `;

    const [result] = await database.query(sql, [user_id, usedItem_post_id, comment_text]);

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

// -------------------- GET COMMENTS --------------------
exports.getComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const sql = `
      SELECT c.id, c.comment_text, c.created_at, u.id AS user_id, u.name AS user_name
      FROM usedItem_post_comment c
      JOIN users u ON c.user_id = u.id
      WHERE c.usedItem_post_id = ?
      ORDER BY c.created_at ASC
    `;

    const [results] = await database.query(sql, [id]);

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

// -------------------- DELETE COMMENT --------------------
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await database.query(
      `DELETE FROM usedItem_post_comment WHERE id = ?`,
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

// -------------------- TOGGLE LIKE --------------------
exports.toggle_like = async (req, res) => {
  try {
    const { user_id, usedItem_post_id } = req.body;

    if (!user_id || !usedItem_post_id) {
      return res
        .status(400)
        .json({ message: "user_id and usedItem_post_id are required" });
    }

    const [existing] = await database.query(
      "SELECT `like` FROM usedItem_post_likes WHERE usedItem_post_id = ? AND user_id = ?",
      [usedItem_post_id, user_id]
    );

    let message = "";
    let liked = false;

    if (existing.length > 0) {
      const newLikeValue = existing[0].like ? 0 : 1;

      await database.query(
        "UPDATE usedItem_post_likes SET `like` = ?, updated_at = NOW() WHERE usedItem_post_id = ? AND user_id = ?",
        [newLikeValue, usedItem_post_id, user_id]
      );

      message = newLikeValue
        ? "Post liked successfully"
        : "Post unliked successfully";
      liked = !!newLikeValue;
    } else {
      await database.query(
        "INSERT INTO usedItem_post_likes (usedItem_post_id, user_id, `like`) VALUES (?, ?, 1)",
        [usedItem_post_id, user_id]
      );

      message = "Post liked successfully";
      liked = true;
    }

    const [result] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM usedItem_post_likes WHERE usedItem_post_id = ? AND `like` = 1",
      [usedItem_post_id]
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

// -------------------- GET LIKE STATUS --------------------
exports.getlike_status = async (req, res) => {
  try {
    const { usedItem_post_id } = req.query;

    if (!usedItem_post_id) {
      return res.status(400).json({ message: "usedItem_post_id is required" });
    }

    const [likes] = await database.query(
      `SELECT u.id AS user_id, u.name AS user_name
       FROM usedItem_post_likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.usedItem_post_id = ? AND l.like = 1`,
      [usedItem_post_id]
    );

    const totalLikes = likes.length;

    res.status(200).json({
      message: "All likes fetched successfully",
      usedItem_post_id,
      total_likes: totalLikes,
      liked_users: likes
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};