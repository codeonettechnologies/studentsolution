const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/database");
const db = connectDB();
 
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile_number,
      password,
      college,
      city,
      college_year,
      role,
      profession,
    } = req.body;
 
    const profile_image = req.file ? req.file.filename : null;
    if (!name || !email || !mobile_number || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
 
    
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
 
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    await new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users
        (name, email, mobile_number, password, college, city, college_year, role, profession, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
 
      db.query(
        sql,
        [
          name,
          email,
          mobile_number,
          hashedPassword,
          college,
          city,
          college_year,
          role,
          profession,
          profile_image,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
 
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
 
  const sql = "SELECT * FROM users WHERE email = ?";
 
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });
 
    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
 
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
 
 
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
   
 
    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        city: user.city,
        field: user.field,
        college_year: user.college_year,
        role: user.role,
        profile_image: user.profile_image,
        mobile_number:user.mobile_number,
      },
    });
  });
};
 
exports.getAllUsers = async (req, res) => {
  try {
    const sql = "SELECT id, name, email, college, city, field, college_year, role, profile_image, mobile_number FROM users";

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(200).json({
        message: "Users fetched successfully!",
        users: results,
      });
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
