const connectDB = require("../../config/database");
const db = connectDB();

exports.createTiffinAsk = async (req, res) => {
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
      const sql = "INSERT INTO tiffin_ask (user_id, content) VALUES (?, ?)";
      db.query(sql, [user_id, content], (err, result) => {
        if (err) throw err;
        res.status(201).json({ 
          message: "tiffin ask created successfully", 
          tiffin_ask_id: result.insertId 
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getAllTiffinAsks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        ta.id,
        ta.content,
        ta.created_at,
        ta.updated_at,
        u.name,
        u.profile_image,
        u.type,
        u.college
      FROM tiffin_ask ta
      JOIN users u ON ta.user_id = u.id
      ORDER BY ta.created_at DESC
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