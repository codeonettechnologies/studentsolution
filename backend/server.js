const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// Database connection
const connectDB = require("./config/database");

// Routes
// const jobRoutes = require("./job/routes/jobRoute");        
const jobPostRoutes = require("./job/routes/jobRoute"); 
const authRoutes = require("./authController/authRoutes");
const coachingRoutes = require("./coaching/routes/coachingRoutes");

dotenv.config();

const app = express();
app.use(express.json());

connectDB();


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/auth", authRoutes);
app.use("/coaching-posts",coachingRoutes);
app.use("/job-posts", jobPostRoutes);
        
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
