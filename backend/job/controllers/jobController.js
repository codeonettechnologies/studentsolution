const connectDB = require("../../config/database");
const db = connectDB();

exports.job_post = (req, res) => {
  try {
    const { user_id, content } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const sql =
      "INSERT INTO job_post (user_id, image_url , content) VALUES (?, ? , ?)";

    db.query(sql, [user_id, image_url, content], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(201).json({
        message: "Job post created",
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
exports.get_all_job_posts = (req, res) => {
  try {
    const sql = "SELECT * FROM job_post ORDER BY id DESC"; // latest posts first

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(200).json({
        message: "All job posts fetched",
        data: results,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// by id

exports.get_job_post_by_id = (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Job post id is required" });
    }

    const sql = "SELECT * FROM job_post WHERE id = ?";

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Job post not found" });
      }

      res.status(200).json({
        message: "Job post fetched",
        data: results[0],
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.delete_job_post = (req, res) => {
  try {
    const { id } = req.params; // get id from URL

    if (!id) {
      return res.status(400).json({ message: "Job post id is required" });
    }

    const sql = "DELETE FROM job_post WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Job post not found" });
      }

      res.status(200).json({ message: "Job post deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//------------------------------------------------------------------------------------

exports.add_like = (req, res) => {
  try {
    const { user_id, job_post_id } = req.body;

    if (!user_id || !job_post_id) {
      return res
        .status(400)
        .json({ message: "user_id and job_post_id are required" });
    }

    const sql =
      "INSERT INTO job_post_likes (job_post_id, user_id) VALUES (?, ?)";

    db.query(sql, [job_post_id, user_id], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "You already liked this post" });
        }
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(201).json({ message: "Post liked successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.remove_like = (req, res) => {
  try {
    const { user_id, job_post_id } = req.body;

    if (!user_id || !job_post_id) {
      return res
        .status(400)
        .json({ message: "user_id and job_post_id are required" });
    }

    const sql =
      "DELETE FROM job_post_likes WHERE job_post_id = ? AND user_id = ?";

    db.query(sql, [job_post_id, user_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Like not found" });
      }

      res.status(200).json({ message: "Like removed successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//---------------------------------------------------------

exports.get_likes = (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT COUNT(*) AS like_count, GROUP_CONCAT(user_id) AS users
      FROM job_post_likes
      WHERE job_post_id = ?
    `;

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(200).json({
        message: "Likes fetched successfully",
        data: results[0],
      });
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
    const { user_id, job_post_id, comment_text } = req.body;

    if (!user_id || !job_post_id || !comment_text) {
      return res.status(400).json({
        message: "user_id, job_post_id and comment_text are required",
      });
    }

    const sql =
      "INSERT INTO job_post_comments (job_post_id, user_id, comment_text) VALUES (?, ?, ?)";

    db.query(sql, [job_post_id, user_id, comment_text], (err, result) => {
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
      FROM job_post_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.job_post_id = ?
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
        .json({ message: "Comments fetched successfully", data: results });
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

    const sql = "DELETE FROM job_post_comments WHERE id = ?";

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
