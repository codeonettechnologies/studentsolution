const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

exports.createGeneralAsk = async (req, res) => {
  try {
    const { content, user_id } = req.body;
  
  
    if (!content || !user_id) {
      return res.status(400).json({ message: "Content and user_id are required" });
    }

    db.query("SELECT * FROM users WHERE id = ?", [user_id], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const sql = "INSERT INTO general_ask (user_id, content) VALUES (?, ?)";
      db.query(sql, [user_id, content], (err, result) => {
        if (err) throw err;
        res.status(201).json({ 
          message: "general ask created successfully", 
          general_ask_id: result.insertId 
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getAllGeneralAsks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        ga.id,
        ga.content,
        ga.created_at,
        ga.updated_at,
        u.name,
        u.profile_image,
        u.role,
        u.college
      FROM general_ask ga
      JOIN users u ON ga.user_id = u.id
      ORDER BY ga.created_at DESC
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

exports.getGeneralAsktsByUserId = async (req, res) => {
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
         ga.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM general_ask ga
       JOIN users u ON ga.user_id = u.id
       WHERE ga.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching general asks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};



exports.searchAskGenerals = async (req, res) => {
  try {
    const { query } = req.query;
 
    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }
 
    const sql = `
      SELECT ga.*,
      u.college,
      u.profile_image,
      u.name
      FROM general_ask ga
      JOIN users u ON ga.user_id = u.id
      WHERE u.name LIKE ? OR ga.content LIKE ?
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
 
      const sql = "DELETE FROM general_ask WHERE id = ?";
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
 



exports.getUserGeneralAsk = (req, res) => {
  const userId = req.params.id;
  const userSql = `SELECT * FROM users WHERE id = ?`;

  db.query(userSql, [userId], (userErr, userResult) => {
    if (userErr) {
      console.log("User Fetch Error:", userErr);
      return res.status(500).json({ message: "Database error" });
    }

    if (userResult.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const user = userResult[0];
    const postSql = `
      SELECT
          jp.*,
          u.name AS user_name,
          u.profile_image AS user_profile,
          u.college AS user_college,
          u.college_year AS user_year,
 
          -- Total Likes
          (
            SELECT COUNT(*)
            FROM general_post_likes jl
            WHERE jl.general_post_id = jp.id AND jl.like = 1
          ) AS total_likes,
 
          -- Total Comments
          (
            SELECT COUNT(*)
            FROM general_post_comments jc
            WHERE jc.general_post_id = jp.id
          ) AS total_comments,
 
          -- Liked Users JSON
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'user_id', lu.id,
                'name', lu.name,
                'profile_image', lu.profile_image
              )
            )
            FROM general_post_likes jl
            JOIN users lu ON jl.user_id = lu.id
            WHERE jl.general_post_id = jp.id AND jl.like = 1
          ) AS liked_users,
 
          -- Comments JSON
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'comment_id', c.id,
                'comment_text', c.comment_text,
                'user_id', cu.id,
                'name', cu.name,
                'profile_image', cu.profile_image
              )
            )
            FROM general_post_comments c
            JOIN users cu ON c.user_id = cu.id
            WHERE c.general_post_id = jp.id
          ) AS comments_data
 
      FROM general_post jp
      JOIN users u ON jp.user_id = u.id
      WHERE jp.user_id = ?
      ORDER BY jp.id DESC
    `;
    db.query(postSql, [userId], (postErr, postResults) => {
      if (postErr) {
        console.log("Post Fetch Error:", postErr);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({
        message: "User + general posts fetched successfully",
        user: user,
        posts: postResults,
      });
    });
  });
};
