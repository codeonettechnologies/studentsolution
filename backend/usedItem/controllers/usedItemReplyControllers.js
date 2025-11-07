const connectDB = require("../../config/database");
const db = connectDB();

// ✅ Create Reply
exports.createReply = async (req, res) => {
  try {
    const { user_id, ask_reply_id, content } = req.body;

    if (!user_id || !ask_reply_id || !content) {
      return res
        .status(400)
        .json({ message: "user_id, ask_reply_id and content are required" });
    }

    // Check if user exists
    db.query("SELECT * FROM users WHERE id = ?", [user_id], (err, userResult) => {
      if (err) throw err;
      if (userResult.length === 0) {
        return res.status(400).json({ message: "User does not exist" });
      }

      // Check if ask exists
      db.query(
        "SELECT * FROM usedItem_ask WHERE id = ?",
        [ask_reply_id],
        (err, askResult) => {
          if (err) throw err;
          if (askResult.length === 0) {
            return res.status(400).json({ message: "Ask does not exist" });
          }

          // Insert reply
          const sql =
            "INSERT INTO usedItem_reply (user_id, ask_reply_id, content) VALUES (?, ?, ?)";
          db.query(sql, [user_id, ask_reply_id, content], (err, result) => {
            if (err) throw err;
            res.status(201).json({
              message: "Reply added successfully",
              reply_id: result.insertId,
            });
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Get Replies by Ask ID
exports.getRepliesByAskId = async (req, res) => {
  try {
    const { ask_reply_id } = req.params;

    if (!ask_reply_id) {
      return res.status(400).json({ message: "ask_reply_id is required" });
    }

    const sql = `
      SELECT 
        ur.id,
        ur.content,
        ur.created_at,
        ur.updated_at,
        u.name,
        u.profile_image,
        u.role,
        u.college
      FROM usedItem_reply ur
      JOIN users u ON ur.user_id = u.id
      WHERE ur.ask_reply_id = ?
      ORDER BY ur.created_at ASC
    `;

    db.query(sql, [ask_reply_id], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Delete Reply
exports.delete_reply = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM usedItem_reply WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error", err);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Reply not found" });
      }

      res.status(200).json({ message: "Reply deleted successfully" });
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
