const mysql = require('mysql2');
const dotenv = require("dotenv")
dotenv.config();

console.log(process.env.DB_NAME);


const connectDB = () => {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
