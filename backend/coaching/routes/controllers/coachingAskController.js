const connectDB = require("../../../config/database");
const database = connectDB().promise();

const db = connectDB();
const database = connectDB().promise();


exports.createCoachingAsk = async (req, res) => {
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
      const sql = "INSERT INTO coaching_ask (user_id, content) VALUES (?, ?)";
      db.query(sql, [user_id, content], (err, result) => {
        if (err) throw err;
        res.status(201).json({ 
          message: "Coaching ask created successfully", 
          coaching_ask_id: result.insertId 
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getAllCoachingAsks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        ca.id,
        ca.content,
        ca.created_at,
        ca.updated_at,
        u.name,
        u.profile_image,
        u.role,
        u.college
      FROM coaching_ask ca
      JOIN users u ON ca.user_id = u.id
      ORDER BY ca.created_at DESC
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

exports.getCoachingAsktsByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID. It must be a positive number.',
    });
  }

  try {
    const [rows] = await database.execute(
      `SELECT 
         ca.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM coaching_ask ca
       JOIN users u ON ca.user_id = u.id
       WHERE ca.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching job asks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
