const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();
 
exports.entertainmentPost = (req, res) => {
  try {
    const { user_id, content } = req.body;
    const image_url = req.file ? req.file.filename : null;
 
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
 
    const sql =
      "INSERT INTO entertainment_post (user_id, image_url , content) VALUES (?, ? , ?)";
 
    db.query(sql, [user_id, image_url, content], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }
 
      res.status(201).json({
        message: "Entertainment post created",
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
exports.getall_entertainment_posts = (req, res) => {
  try {
    const sql = `
      SELECT
        ep.*,
        u.name AS user_name,
        u.profile_image AS profile_image,
        u.college AS user_college,
        u.college_year AS user_year
      FROM entertainment_post ep
      JOIN users u ON ep.user_id = u.id
      ORDER BY ep.id DESC
    `;
 
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }
 
      res.status(200).json({
        message: "All Entertainment posts fetched",
        data: results,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
 // Get SelfEntertainment Post
exports.getentertainmentPosts_byUserId = async (req, res) => {
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
         ep.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM entertainment_post ep
       JOIN users u ON ep.user_id = u.id
       WHERE ep.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching Entertainment posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
 
 //Delete Post 
exports.delete_entertainmentPosts = (req, res) => {
  try {
    const { id } = req.params;
 
    if (!id) {
      return res.status(400).json({ message: "Entertainment  post id is required" });
    }
 
    const sql = "DELETE FROM entertainment_post WHERE id = ?";
 
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }
 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Entertainment post not found" });
      }
 
      res.status(200).json({ message: "Entertainment post deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
 
//------------------------comment_text---------------------------------------
 
exports.add_comment = (req, res) => {
  try {
    const { user_id, entertainment_post_id, comment_text } = req.body;
 
    if (!user_id || !entertainment_post_id || !comment_text) {
      return res.status(400).json({
        message: "user_id, entertainment_post_id and comment_text are required",
      });
    }
 
    const sql =
      "INSERT INTO entertainment_post_comment (entertainment_post_id, user_id, comment_text) VALUES (?, ?, ?)";
 
    db.query(sql, [entertainment_post_id, user_id, comment_text], (err, result) => {
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
 

// Get all comment 
exports.get_comments = (req, res) => {
  try {
    const { id } = req.params;
 
    const sql = `
      SELECT c.id, c.comment_text, c.created_at, u.id AS user_id, u.name AS user_name
      FROM entertainment_post_comment c
      JOIN users u ON c.user_id = u.id
      WHERE c.entertainment_post_id = ?
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
 

// Delete Comment 
exports.delete_comment = (req, res) => {
  try {
    const { id } = req.params;
 
    const sql = "DELETE FROM entertainment_post_comment WHERE id = ?";
 
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
    const { user_id, entertainment_post_id } = req.body;
 
    if (!user_id || !entertainment_post_id) {
      return res.status(400).json({ message: "user_id and entertainment_post_id are required" });
    }
 
    const [existing] = await database.query(
      "SELECT `like` FROM entertainment_post_likes WHERE entertainment_post_id = ? AND user_id = ?",
      [entertainment_post_id, user_id]
    );
 
    let message = "";
    let liked = false;
 
    if (existing.length > 0) {
   
      const newLikeValue = existing[0].like ? 0 : 1;
 
      await database.query(
        "UPDATE entertainment_post_likes SET `like` = ?, updated_at = NOW() WHERE entertainment_post_id = ? AND user_id = ?",
        [newLikeValue, entertainment_post_id, user_id]
      );
 
      message = newLikeValue ? "Post liked successfully" : "Post unliked successfully";
      liked = !!newLikeValue;
    } else {
   
      await database.query(
        "INSERT INTO entertainment_post_likes (entertainment_post_id, user_id, `like`) VALUES (?, ?, 1)",
        [job_post_id, user_id]
      );
 
      message = "Post liked successfully";
      liked = true;
    }
 
 
    const [result] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM entertainment_post_likes WHERE entertainment_post_id = ? AND `like` = 1",
      [entertainment_post_id]
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
 
 // Get like 
 exports.get_like_status = async (req, res) => {
  try {
    const { entertainment_post_id, user_id } = req.query;
 
    if (!entertainment_post_id) {
      return res.status(400).json({ message: "entertainment_post_id is required" });
    }
 
    // Total likes count
    const [likeCount] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM entertainment_post_likes WHERE entertainment_post_id = ? AND `like` = 1",
      [entertainment_post_id]
    );
 
    let liked = false;
    let userName = null;
 
    // If user_id is provided, check like status and fetch user name
    if (user_id) {
      const [userLike] = await database.query(
        "SELECT * FROM entertainment_post_likes WHERE entertainment_post_id = ? AND user_id = ? AND `like` = 1",
        [entertainment_post_id, user_id]
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
      entertainment_post_id,
      liked,
      total_likes: likeCount[0].total_likes,
      user_name: userName || "Guest"
    });
 
  } catch (error) {
    console.error("Get like status error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 


//Search CoachingPost
exports.searchEntertainments = async (req, res) => {
  try {
    const { query } = req.query;
 
    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }
 
    const sql = `
      SELECT ep.*, u.name, u.college
      FROM entertainment_post ep
      JOIN users u ON ep.user_id = u.id
      WHERE u.name LIKE ? OR u.college LIKE ?
    `;
 
    const searchValue = `%${query}%`;
 
    db.query(sql, [searchValue, searchValue], (err, results) => {
      if (err) {
        console.error(" Database Error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }
      res.json(results);
    });
  } catch (error) {
    console.error(" Server Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
 
 