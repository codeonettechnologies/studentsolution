const connectDB = require("../../config/database");
const db = connectDB();

const postNotes = (req, res) => {
  try {
    console.log("incoming" , req.body);
    const user_id = req.body.userId
    const { topic, details } = req.body;

    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({ error: "Valid user_id is required" });
    }
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: "Topic is required" });
    }
    if (!details || details.trim().length === 0) {
      return res.status(400).json({ error: "Details are required" });
    }

const image_url = req.files['image'] ? req.files['image'][0].filename : null;
const pdf = req.files['pdf'] ? req.files['pdf'][0].filename : null;


    const sql = `
      INSERT INTO notes (user_id, topic, details, image_url, pdf)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [user_id, topic, details, image_url, pdf], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Notes uploaded successfully!", id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getNotes = (req, res) => {
  try {
    const sql = `
      SELECT 
        n.id,
        n.user_id,
        u.name AS user_name,
        n.topic,
        n.details,
        n.image_url,
        n.pdf,
        n.created_at,
        n.updated_at
      FROM notes n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getNotesByUserId = (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID. It must be a positive number.",
    });
  }

  const sql = `
    SELECT 
      n.*, 
      u.name AS user_name, 
      u.profile_image, 
      u.college
    FROM notes n
    JOIN users u ON n.user_id = u.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  });
};



const deleteNotesByUser = (req, res) => {
  const { noteId } = req.params;
  const user_id = req.body.userId
  // const { user_id } = req.body; 


  if (!noteId || isNaN(noteId)) {
    return res.status(400).json({ success: false, message: "Invalid note ID" });
  }
  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  // Step 1: Check if this note belongs to the logged-in user
  const checkSql = `SELECT * FROM notes WHERE id = ? AND user_id = ?`;
  db.query(checkSql, [noteId, user_id], (err, result) => {
    if (err) {
      console.error("Error checking note:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized — you can only delete your own notes",
      });
    }

    // Step 2: Delete note
    const deleteSql = `DELETE FROM notes WHERE id = ?`;
    db.query(deleteSql, [noteId], (err2) => {
      if (err2) {
        console.error("Error deleting note:", err2);
        return res.status(500).json({ success: false, message: "Server error" });
      }

      res.status(200).json({
        success: true,
        message: "Note deleted successfully",
      });
    });
  });
};




const searchNotes = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const searchValue = `%${query}%`;

  const sql = `
    SELECT 
      n.*, 
      u.name AS user_name
    FROM notes n
    JOIN users u ON n.user_id = u.id
    WHERE u.name LIKE ? OR n.topic LIKE ?
    ORDER BY n.created_at DESC
  `;

  db.query(sql, [searchValue, searchValue], (err, result) => {
    if (err) {
      console.error("Error searching notes:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while searching notes",
      });
    }

    res.status(200).json({
      success: true,
      total: result.length,
      data: result,
    });
  });
};





module.exports = {postNotes , getNotes ,getNotesByUserId  ,deleteNotesByUser , searchNotes};
