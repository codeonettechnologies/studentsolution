const mysql = require('mysql2');
const dotenv = require("dotenv")
dotenv.config();

const connectDB = () => {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  db.connect((err) => {
    if (err) {
      console.error(' MySQL connection failed:', err.message);
      process.exit(1); 
    } else {
      console.log('Connected to MySQL Database!');
    }
  });

  return db; 
};

module.exports = connectDB;


