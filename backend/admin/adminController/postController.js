const connectDB = require("../../config/database");
const db = connectDB();

exports.addCollege = async (req, res) => {
  try {
    const { college } = req.body;

    if (!college) {
      return res.status(400).json({ message: "College college is required" });
    }
    const query = "INSERT INTO colleges (college) VALUES (?)";

    db.query(query, [college], (err, result) => {
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

exports.deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "College ID is required" });
    }

    const query = "DELETE FROM colleges WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting college:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "College not found" });
      }
      res.status(200).json({ message: "College deleted successfully" });
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
    res
      .status(201)
      .json({ message: "Ad added successfully", id: result.insertId });
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

    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

    let image = null;
    let video = null;

    // Check uploaded files
    if (req.files?.image) {
      image = req.files.image[0].filename; // or path
    }

    if (req.files?.video) {
      video = req.files.video[0].filename; // or path
    }

    // If neither provided
    if (!image && !video) {
      return res.status(400).json({
        message: "Provide at least image or video to update",
      });
    }

    let fields = [];
    let values = [];

    if (image) {
      fields.push("image = ?");
      values.push(image);
    }

    if (video) {
      fields.push("video = ?");
      values.push(video);
    }

    const query = `UPDATE ads SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Ad not found" });
      }

      res.json({ message: "Ad updated successfully" });
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};





exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Ad ID is required" });
    }

    const query = "DELETE FROM ads WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting ad:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Ad not found" });
      }

      res.status(200).json({ message: "Ad deleted successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// city

exports.addCity = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ message: "city is required" });
    }
    const query = "INSERT INTO cities (city) VALUES (?)";

    db.query(query, [city], (err, result) => {
      if (err) {
        console.error("Error adding city:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({
        message: "city added successfully",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCity = async (req, res) => {
  try {
    const query = "SELECT * FROM cities ORDER BY id DESC";

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

exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "City ID is required" });
    }

    const query = "DELETE FROM cities WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting city:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "city not found" });
      }
      res.status(200).json({ message: "city deleted successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// profesion

exports.addProfessions = async (req, res) => {
  try {
    const { profession } = req.body;

    if (!profession) {
      return res.status(400).json({ message: "profession is required" });
    }
    const query = "INSERT INTO professions (profession) VALUES (?)";

    db.query(query, [profession], (err, result) => {
      if (err) {
        console.error("Error adding profession:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({
        message: "profession added successfully",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProfessions = async (req, res) => {
  try {
    const query = "SELECT * FROM professions ORDER BY id DESC";

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching profession:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProfessions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "profession ID is required" });
    }
    const query = "DELETE FROM professions WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting profession:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "profession not found" });
      }
      res.status(200).json({ message: "profession deleted successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






