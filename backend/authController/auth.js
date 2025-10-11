const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/database")
const db = connectDB()


exports.register = (req, res) => {
  const {
    name,
    email,
    mobile_number,
    password,
    college,
    city,
    field,
    college_year,
    type
  } = req.body;

  const profile_image = req.file ? req.file.filename : null;

  if (!name || !email || !mobile_number || !password) {
    return res.status(400).json({
         message: "All required fields must be filled"
         });
  }


  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `INSERT INTO users (name, email, mobile_number, password, college, city, field, college_year, type, profile_image)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [name, email, mobile_number, hashedPassword, college, city, field, college_year, type, profile_image],
    (err, result) => {
      if (err) {
        console.error(" Error inserting user:", err);
        return res.status(500).json({
             message: "Database error", error: err
             });
      }
      res.status(201).json({
         message: "User registered successfully!"
         });
    }
  );
};



exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "Invalid email or password" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

   console.log(process.env.JWT_SECRET);
   
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
      console.log(process.env.NODE_ENV);
      

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
 console.log(token);
 
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
        type: user.type,
        profile_image: user.profile_image,
      },
    });
  });
};