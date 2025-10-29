const connectDB = require("../../config/database");
const db = connectDB();

exports.createReply = async (req, res) => {
  try {
    const { user_id, ask_reply_id, content } = req.body;

    if (!user_id || !ask_reply_id || !content) {
      return res.status(400).json({ message: "user_id, ask_reply_id and content are required" });
    }

    // Optional: check if user exists
    db.query("SELECT * FROM users WHERE id = ?", [user_id], (err, userResult) => {
      if (err) throw err;
      if (userResult.length === 0) {
        return res.status(400).json({ message: "User does not exist" });
      }

      // Optional: check if question exists
      db.query("SELECT * FROM entertainment_ask WHERE id = ?", [ask_reply_id], (err, askResult) => {
        if (err) throw err;
        if (askResult.length === 0) {
          return res.status(400).json({ message: "Question does not exist" });
        }

        // Insert reply
        const sql = "INSERT INTO entertainment_reply (user_id, ask_reply_id, content) VALUES (?, ?, ?)";
        db.query(sql, [user_id, ask_reply_id, content], (err, result) => {
          if (err) throw err;
          res.status(201).json({ 
            message: "Reply added successfully",
            reply_id: result.insertId
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};



exports.getRepliesByAskId = async (req, res) => {
  try {
    const { ask_reply_id } = req.params;

    if (!ask_reply_id) {
      return res.status(400).json({ message: "ask_reply_id is required" });
    }
    const sql = `
      SELECT 
        er.id,
        er.content,
        er.created_at,
        er.updated_at,
        u.name,
        u.profile_image,
        u.role,
        u.college
      FROM entertainment_reply er
      JOIN users u ON er.user_id = u.id
      WHERE er.ask_reply_id = ?
      ORDER BY er.created_at ASC
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
