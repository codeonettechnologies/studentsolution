const connectDB = require("../../config/database");
const db = connectDB();

exports.createJobAsk = async (req, res) => {
  try {
    const { content, user_id } = req.body;

    if (!content || !user_id) {
      return res.status(400).json({ message: "Content and user_id are required" });
    }

    // Check if user exists
    db.query("SELECT * FROM users WHERE id = ?", [user_id], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.status(400).json({ message: "User does not exist" });
      }

      // Insert question
      const sql = "INSERT INTO job_ask (user_id, content) VALUES (?, ?)";
      db.query(sql, [user_id, content], (err, result) => {
        if (err) throw err;
        res.status(201).json({ 
          message: "Job ask created successfully", 
          job_ask_id: result.insertId 
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getAllJobAsks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        ja.id,
        ja.content,
        ja.created_at,
        ja.updated_at,
        u.name,
        u.profile_image,
        u.type,
        u.college
      FROM job_ask ja
      JOIN users u ON ja.user_id = u.id
      ORDER BY ja.created_at DESC
    `;

    db.query(sql, (err, results) => {
      if (err) throw err;  // will be caught in catch
      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};