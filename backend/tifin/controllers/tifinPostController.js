const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

exports.tiffin_post = (req, res) => {
  try {
    const { user_id, content } = req.body;
    const image_url = req.file ? req.file.filename : null;
 console.log(image_url);
 
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const sql =
      "INSERT INTO tiffin_post (user_id, image_url , content) VALUES (?, ? , ?)";

    db.query(sql, [user_id, image_url, content], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(201).json({
        message: "tiffin post created",
        id: result.insertId,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.get_all_tiffin_posts = (req, res) => {
  try {
    const sql = `
      SELECT
        tp.*,
        u.name AS user_name,
        u.profile_image AS profile_image,
        u.college AS user_college,
        u.college_year AS user_year
      FROM tiffin_post tp
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
        message: "All tiffin posts fetched",
        data: results,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getTiffinPostsByUserId = async (req, res) => {
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
         tp.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM tiffin_post tp
       JOIN users u ON tp.user_id = u.id
       WHERE tp.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching tiffin posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.delete_tiffin_post = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "tiffin post id is required" });
    }

    const sql = "DELETE FROM tiffin_post WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "tiffin post not found" });
      }

      res.status(200).json({ message: "tiffin post deleted successfully" });
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
    const { user_id, tiffin_post_id, comment_text } = req.body;
 
    if (!user_id || !tiffin_post_id || !comment_text) {
      return res.status(400).json({
        message: "user_id, tiffin_post_id and comment_text are required",
      });
    }
 
    const sql =
      "INSERT INTO tiffin_post_comment (tiffin_post_id, user_id, comment_text) VALUES (?, ?, ?)";
 
    db.query(sql, [tiffin_post_id, user_id, comment_text], (err, result) => {
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
      FROM tiffin_post_comment c
      JOIN users u ON c.user_id = u.id
      WHERE c.tiffin_post_id = ?
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
 
    const sql = "DELETE FROM tiffin_post_comment WHERE id = ?";
 
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
    const { user_id, tiffin_post_id } = req.body;
 
    if (!user_id || !tiffin_post_id) {
      return res.status(400).json({ message: "user_id and tiffin_post_id are required" });
    }
 
    const [existing] = await database.query(
      "SELECT `like` FROM tiffin_post_likes WHERE tiffin_post_id = ? AND user_id = ?",
      [tiffin_post_id, user_id]
    );
 
    let message = "";
    let liked = false;
 
    if (existing.length > 0) {
   
      const newLikeValue = existing[0].like ? 0 : 1;
 
      await database.query(
        "UPDATE tiffin_post_likes SET `like` = ?, updated_at = NOW() WHERE tiffin_post_id = ? AND user_id = ?",
        [newLikeValue, tiffin_post_id, user_id]
      );
 
      message = newLikeValue ? "Post liked successfully" : "Post unliked successfully";
      liked = !!newLikeValue;
    } else {
   
      await database.query(
        "INSERT INTO tiffin_post_likes (tiffin_post_id, user_id, `like`) VALUES (?, ?, 1)",
        [tiffin_post_id, user_id]
      );
 
      message = "Post liked successfully";
      liked = true;
    }
 
 
    const [result] = await database.query(
      "SELECT COUNT(*) AS total_likes FROM tiffin_post_likes WHERE tiffin_post_id = ? AND `like` = 1",
      [tiffin_post_id]
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

    
    const {  tiffin_post_id } = req.query;

    if (! tiffin_post_id) {
      return res.status(400).json({ message: " tiffin_post_id is required" });
    }

    // Fetch all users who liked this post
    const [likes] = await database.query(
      `SELECT u.id AS user_id, u.name AS user_name
       FROM  tiffin_post_likes l
       JOIN users u ON l.user_id = u.id
       WHERE l. tiffin_post_id = ? AND l.like = 1`,
      [ tiffin_post_id]
    );

    // Total likes count
    const totalLikes = likes.length;

    res.status(200).json({
      message: "All likes fetched successfully",
       tiffin_post_id,
      total_likes: totalLikes,
      liked_users: likes
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


exports.searchTiffinPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const searchValue = `%${query}%`;

    // 🧩 Step 1: Fetch main tiffin posts + user info (include profile and college)
    const sql = `
      SELECT 
        tp.*, 
        u.name AS user_name,
        u.profile_image AS user_profile,
        u.college AS user_college_name
      FROM tiffin_post tp
      JOIN users u ON tp.user_id = u.id
      WHERE u.name LIKE ? OR tp.content LIKE ?
      ORDER BY tp.created_at DESC
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

      // 🧩 Step 2: Likes (no profile image)
      const likesSql = `
        SELECT l.tiffin_post_id, u.id AS user_id, u.name AS user_name
        FROM tiffin_post_likes l
        JOIN users u ON l.user_id = u.id
        WHERE l.tiffin_post_id IN (?) AND l.like = 1
      `;

      // 🧩 Step 3: Comments (no profile image)
      const commentsSql = `
        SELECT c.tiffin_post_id, c.comment_text, u.id AS user_id, u.name AS user_name
        FROM tiffin_post_comment c
        JOIN users u ON c.user_id = u.id
        WHERE c.tiffin_post_id IN (?)
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

          // 🧩 Step 4: Merge all data
          const result = posts.map((post) => {
            const postLikes = likes.filter(
              (l) => l.tiffin_post_id === post.id
            );
            const postComments = comments.filter(
              (c) => c.tiffin_post_id === post.id
            );

            return {
              id: post.id,
              user_id: post.user_id,
              image_url: post.image_url,
              content: post.content,
              created_at: post.created_at,
              updated_at: post.updated_at,

              // ✅ include profile image and college name for main user only
              user_name: post.user_name,
              user_profile: post.user_profile,
              user_college_name: post.user_college_name,

              likes_count: postLikes.length,
              comments_count: postComments.length,

              // ❌ no profile image for likes/comments
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
