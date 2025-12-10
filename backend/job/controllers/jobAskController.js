const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise();

exports.createJobAsk = async (req, res) => {
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
        u.role,
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

exports.getJobAsktsByUserId = async (req, res) => {
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
         ja.*, 
         u.name AS user_name, 
         u.profile_image, 
         u.college
       FROM job_ask ja
       JOIN users u ON ja.user_id = u.id
       WHERE ja.user_id = ?`,
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



exports.searchAskJobs = async (req, res) => {
  try {
    const { query } = req.query;
 
    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }
 
    const sql = `
      SELECT ja.*,
      u.college,
       u.profile_image,
      u.name
      FROM Job_ask ja
      JOIN users u ON ja.user_id = u.id
      WHERE u.name LIKE ? OR ja.content LIKE ?
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
 
      const sql = "DELETE FROM job_ask WHERE id = ?";
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
 


exports.getUserJobAsk = (req, res) => {
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
    const { password,mobile_number, ...user } = userResult[0];  
    const postSql = `
      SELECT
        ja.*,
        u.name AS name,
        u.profile_image AS profile,
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'reply_id', jr.id,
                    'reply_content', jr.content,
                    'reply_user_id', ur.id,
                    'reply_user_name', ur.name,
                    'reply_user_image', ur.profile_image,
                    'reply_created_at', jr.created_at
                )
            )

            FROM job_reply jr
            JOIN users ur ON jr.user_id = ur.id
            WHERE jr.ask_reply_id = ja.id
        ) AS replies
      FROM job_ask ja
      JOIN users u ON ja.user_id = u.id
      WHERE ja.user_id = ?
      ORDER BY ja.id DESC;

    `;

    db.query(postSql, [userId], (postErr, postResults) => {
      if (postErr) {
        console.log("Post Fetch Error:", postErr);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({
        message: "User + Job Ask fetched successfully",
        user: user,
        posts: postResults,
      });
    });
  });
};