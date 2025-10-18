const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

exports.tifin_post = (req, res) => {
  try {
    const { user_id, content } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const sql =
      "INSERT INTO tifin_post (user_id, image_url , content) VALUES (?, ? , ?)";

    db.query(sql, [user_id, image_url, content], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(201).json({
        message: "tifin post created",
        id: result.insertId,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.get_all_tifin_posts = (req, res) => {
  try {
    const sql = `
      SELECT
        tp.*,
        u.name AS user_name,
        u.profile_image AS profile_image,
        u.college AS user_college,
        u.college_year AS user_year
      FROM tifin_post tp
      JOIN users u ON tp.user_id = u.id
      ORDER BY tp.id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(200).json({
        message: "All tifin posts fetched",
        data: results,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getTifinPostsByUserId = async (req, res) => {
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
      "SELECT * FROM tifin_post WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching tifin posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.delete_tifin_post = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "tifin post id is required" });
    }

    const sql = "DELETE FROM tifin_post WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "tifin post not found" });
      }

      res.status(200).json({ message: "tifin post deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};





//------------------------comment_text---------------------------------------
 
exports.post_comment = (req, res) => {
  try {
    const { user_id, tifin_post_id, comment_text } = req.body;
 
    if (!user_id || !tifin_post_id || !comment_text) {
      return res.status(400).json({
        message: "user_id, tifin_post_id and comment_text are required",
      });
    }
 
    const sql =
      "INSERT INTO tifin_post_comment (tifin_post_id, user_id, comment_text) VALUES (?, ?, ?)";
 
    db.query(sql, [tifin_post_id, user_id, comment_text], (err, result) => {
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
      FROM tifin_post_comment c
      JOIN users u ON c.user_id = u.id
      WHERE c.tifin_post_id = ?
      ORDER BY c.created_at ASC
    `;
 
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }
 
      res
        .status(200)
        .json({
          message: "Comments fetched successfully",
           data: results
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
 
    const sql = "DELETE FROM tifin_post_comment WHERE id = ?";
 
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
 
//----------------------like ---------------------------------------------------------


exports.toggle_like = async (req, res) => {
  try {
    const { user_id, tifin_post_id } = req.body;
 
    if (!user_id || !tifin_post_id) {
      return res.status(400).json({ message: "user_id and tifin_post_id are required" });
    }
 
    const [existing] = await database.query(
      "SELECT `like` FROM tifin_post_likes WHERE tifin_post_id = ? AND user_id = ?",
      [tifin_post_id, user_id]
    );
 
    let message = "";
    let liked = false;
 
    if (existing.length > 0) {
   
      const newLikeValue = existing[0].like ? 0 : 1;
 
      await database.query(
        "UPDATE tifin_post_likes SET `like` = ?, updated_at = NOW() WHERE tifin_post_id = ? AND user_id = ?",
        [newLikeValue, tifin_post_id, user_id]
      );
 
      message = newLikeValue ? "Post liked successfully" : "Post unliked successfully";
      liked = !!newLikeValue;
    } else {
   
      await database.query(
        "INSERT INTO tifin_post_likes (tifin_post_id, user_id, `like`) VALUES (?, ?, 1)",
        [tifin_post_id, user_id]
      );
 
      message = "Post liked successfully";
      liked = true;
    }
 
 
    const [result] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM tifin_post_likes WHERE tifin_post_id = ? AND `like` = 1",
      [tifin_post_id]
    );
 
    res.status(200).json({
      message,
      liked,
      total_likes: result[0].total_likes,
    });
 
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
 
 exports.get_like_status = async (req, res) => {
  try {
    const { tifin_post_id, user_id } = req.query;

    if (!tifin_post_id) {
      return res.status(400).json({ message: "tifin_post_id is required" });
    }

    // 🟩 Total likes
    const [likeCount] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM tifin_post_likes WHERE tifin_post_id = ? AND `like` = 1",
      [tifin_post_id]
    );

    let liked = false;
    let userInfo = null;

    // 🟩 If user_id provided, get like status + user details
    if (user_id) {
      const [userLike] = await database.query(
        "SELECT * FROM tifin_post_likes WHERE tifin_post_id = ? AND user_id = ? AND `like` = 1",
        [tifin_post_id, user_id]
      );
      liked = userLike.length > 0;

      // 🟩 Fetch user details
      const [userDetails] = await database.query(
        "SELECT name, profile_image, college FROM users WHERE id = ?",
        [user_id]
      );

      if (userDetails.length > 0) {
        userInfo = userDetails[0];
      }
    }

    res.status(200).json({
      tifin_post_id,
      liked,
      total_likes: likeCount[0].total_likes,
      user: userInfo, // 🟩 user details included here
    });

  } catch (error) {
    console.error("Get like status error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
