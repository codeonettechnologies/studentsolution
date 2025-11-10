const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

exports.createNoteAsk = async (req, res) => {
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
      const sql = "INSERT INTO note_ask (user_id, content) VALUES (?, ?)";
      db.query(sql, [user_id, content], (err, result) => {
        if (err) throw err;
        res.status(201).json({ 
          message: "note ask created successfully", 
          note_ask_id: result.insertId 
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getAllNoteAsks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        na.id,
        na.content,
        na.created_at,
        na.updated_at,
        u.name,
        u.profile_image,
        u.role,
        u.college
      FROM note_ask na
      JOIN users u ON na.user_id = u.id
      ORDER BY na.created_at DESC
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

exports.getNoteAsktsByUserId = async (req, res) => {
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
         na.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM note_ask na
       JOIN users u ON na.user_id = u.id
       WHERE na.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching note asks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};



exports.searchAsknotes = async (req, res) => {
  try {
    const { query } = req.query;
 
    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }
 
    const sql = `
      SELECT na.*,
      u.college,
       u.profile_image,
      u.name
      FROM note_ask na
      JOIN users u ON na.user_id = u.id
      WHERE u.name LIKE ? OR na.content LIKE ?
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
    console.error("Server Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


 
exports.delete_ask = async (req , res)=>{
  try{
     const {id} = req.params;
 
      const sql = "DELETE FROM note_ask WHERE id = ?";
      db.query(sql , [id] , (err , result)=>{
        if(err){
          console.error("Database error" , err);
          return res.status(500).json({
            message: "Database error",
             error: err.message
          })
        }
         if (result.affectedRows === 0) {
        return res.status(404).json({ message: "ask not found" });
      }
         res.status(200).json({ message: "aks deleted successfully" });
      })
  }catch(err){
       res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
 