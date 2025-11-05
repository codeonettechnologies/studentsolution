const connectDB = require("../../config/database");
const db = connectDB();

exports.createTiffinAsk = async (req, res) => {
  try {
    const { content, user_id } = req.body;

    if (!content || !user_id) {
      return res
        .status(400)
        .json({ message: "Content and user_id are required" });
    }

    // Check if user exists
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [user_id],
      (err, userResult) => {
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
            tiffin_ask_id: result.insertId,
          });
        });
      }
    );
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
        u.role,
        u.college
      FROM tiffin_ask ta
      JOIN users u ON ta.user_id = u.id
      ORDER BY ta.created_at DESC
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

exports.getFoodAskByUserId = async (req, res) => {
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
         ta.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM tiffin_ask ta
       JOIN users u ON ta.user_id = u.id
       WHERE ta.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching food asks:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.searchFoodAsk = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: " Search query is required :",
      });
    }
    const sql = `
      SELECT ta.*, u.name
      FROM tiffin_ask ta
      JOIN users u ON ta.user_id = u.id
      WHERE u.name LIKE ? OR ta.content LIKE ? 
     `;
    const searchValue = `%${query}%`;

    db.query(sql, [searchValue, searchValue], (err, result) => {
      if (err) {
        console.error("Database error", err);
        return res.status(500).json({
          message: "Internal server error :",
        });
      }
      res.json(result);
    });
  } catch (err) {
    console.error("Server error", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Tiffin ID is required",
      });
    }

    const sql = `DELETE from tiffin_ask WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error !", err);
        return res.status(500).json({
          message: "Internal server error",
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Food ask not found ",
        });
      }
      res.status(200).json({
        message: "aks deleted successfully",
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: " Internal server ",
    });
  }
};
