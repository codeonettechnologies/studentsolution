const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// Database connection
const connectDB = require("./config/database");

// Routes
// const jobRoutes = require("./job/routes/jobRoute");          // Job routes
const jobPostRoutes = require("./job/routes/jobRoute"); 
const authRoutes = require("./authController/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());

connectDB();


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/job-posts", jobPostRoutes);
        
app.use((req, res, next) => {
  req.db = connectDB;
  next();
});


app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
