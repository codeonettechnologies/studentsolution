const connectDB = require("../../config/database");
const db = connectDB();

exports.addCollege = async (req, res) => {
  try {
    const {college_name } = req.body;

    if (!college_name) {
      return res.status(400).json({ message: "College college_name is required" });
    }
    const query = "INSERT INTO colleges (college_name) VALUES (?)";

    db.query(query, [college_name], (err, result) => {
      if (err) {
        console.error("Error adding college:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({
        message: "College added successfully",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getColleges = async (req, res) => {
  try {
    const query = "SELECT * FROM colleges ORDER BY id DESC";

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching colleges:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.addAd = (req, res) => {
  const image = req.files?.image ? req.files.image[0].filename : null;
  const video = req.files?.video ? req.files.video[0].filename : null;

  if (!image && !video) {
    return res.status(400).json({ message: "Please upload an image or video" });
  }

  const sql = "INSERT INTO ads (image, video) VALUES (?, ?)";
  db.query(sql, [image, video], (err, result) => {
    if (err) {
      console.error("Error inserting ad:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Ad added successfully", id: result.insertId });
  });
};


exports.getAds = async (req, res) => {
  try {
    const query = "SELECT * FROM ads ORDER BY id DESC";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching ads:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { image, video } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Ad ID is required" });
    }

    if (!image && !video) {
      return res.status(400).json({ message: "Please provide image or video to update" });
    }

    if (image && video) {
      return res.status(400).json({ message: "Only one field allowed: image OR video" });
    }

    const query = "UPDATE ads SET image = ?, video = ? WHERE id = ?";
    db.query(query, [image || null, video || null, id], (err, result) => {
      if (err) {
        console.error("Error updating ad:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Ad not found" });
      }

      res.status(200).json({ message: "Ad updated successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
