const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

// ---------------- CREATE ASK ----------------
exports.create_UsedItemAsk = async (req, res) => {
  try {
    const { content, user_id } = req.body;
    console.log(req.body);

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
      const sql = "INSERT INTO usedItem_ask (user_id, content) VALUES (?, ?)";
      db.query(sql, [user_id, content], (err, result) => {
        if (err) throw err;
        res.status(201).json({
          message: "Used item ask created successfully",
          usedItem_ask_id: result.insertId,
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

// ---------------- GET ALL ASKS ----------------
exports.getAll_UsedItemAsks = async (req, res) => {
  try {
    console.log("inside");
    
    const sql = `
      SELECT 
        ua.id,
        ua.content,
        ua.created_at,
        ua.updated_at,
        u.name,
        u.profile_image,
        u.role,
        u.college
      FROM useditem_ask ua
      JOIN users u ON ua.user_id = u.id
      ORDER BY ua.created_at DESC
    `;

    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

// ---------------- GET ASKS BY USER ----------------
exports.get_asksByUserId = async (req, res) => {
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
         ua.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM useditem_ask ua
       JOIN users u ON ua.user_id = u.id
       WHERE ua.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching used item asks:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ---------------- SEARCH ASK ----------------
exports.searchAsk_usedItem = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const sql = `
      SELECT ua.*, u.name
      FROM useditem_ask ua
      JOIN users u ON ua.user_id = u.id
      WHERE u.name LIKE ? OR ua.content LIKE ?
    `;

    const searchValue = `%${query}%`;

    db.query(sql, [searchValue, searchValue], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ---------------- DELETE ASK ----------------
exports.deleteAsk_usedItem = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM useditem_ask WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error", err);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Ask not found" });
      }
      res.status(200).json({ message: "Used item ask deleted successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
